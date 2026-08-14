import React from 'react';
import * as chatbotService from './../../api/chatbotService';
import { TYPING_INDICATOR_MESSAGE } from './BotChatMessage';

interface ActionProviderProps {
    createChatBotMessage: (message: string) => ChatMessage;
    setState: React.Dispatch<React.SetStateAction<StateType>>;
    children: React.JSX.Element;
    state: StateType;
}

interface ChatMessage {
    id: number
    message: string
    type: string
}

interface StateType {
    messages: ChatMessage[]
    gptChatHistory: chatbotService.Message[]
}

const REQUEST_FAILED_MESSAGE = "Sorry, I could not reach the assistant just now. Please try sending your message again.";

const ActionProvider = ({ createChatBotMessage, setState, state, children }: ActionProviderProps) => {
    // The prompt is built from this rather than from `state`, which is a render-time
    // snapshot: a send that starts before an earlier reply lands would otherwise build its
    // prompt from history missing that exchange. Treat it as the source of truth and only
    // append through `settle` below.
    const historyRef = React.useRef<chatbotService.Message[]>(state.gptChatHistory);
    // Requests run one at a time. A turn only enters the history once its reply arrives, so
    // concurrent completions would each prompt with an incomplete, mis-ordered transcript.
    const pendingRef = React.useRef<Promise<void>>(Promise.resolve());

    const newBotMessage = (message: string) => {
        const botMessage = createChatBotMessage(message);
        setState((prev) => ({...prev, messages: [...prev.messages, botMessage], }));
    }

    const requestCompletionMessage = async (message: string )=> {
        const userTurn: chatbotService.Message = {
            content: message,
            role: 'user'
        }
        const typingIndicator = createChatBotMessage(TYPING_INDICATOR_MESSAGE);
        setState((prev) => ({...prev, messages: [...prev.messages, typingIndicator]}));

        // Swapping the indicator in place, by id, keeps each reply under the message it
        // answers while other sends are still queued.
        const settle = (reply: ChatMessage, historyTurns: chatbotService.Message[]) => {
            historyRef.current = [...historyRef.current, ...historyTurns];
            setState((prev) => ({
                ...prev,
                messages: prev.messages.some((m) => m.id === typingIndicator.id)
                    ? prev.messages.map((m) => (m.id === typingIndicator.id ? reply : m))
                    : [...prev.messages, reply],
                gptChatHistory: historyRef.current
            }));
        }

        pendingRef.current = pendingRef.current.then(async () => {
            try {
                const response = await chatbotService.getCompletion({messages: [...historyRef.current, userTurn]});
                const reply = response.choices?.[0]?.messages?.[0]?.content;
                if (!reply) {
                    throw new Error('Completion response carried no message');
                }
                const botMessageForHistory: chatbotService.Message = {
                    content: reply,
                    role: 'assistant'
                }
                settle(createChatBotMessage(reply), [userTurn, botMessageForHistory]);
            } catch (error) {
                console.error('Chatbot completion failed', error);
                settle(createChatBotMessage(REQUEST_FAILED_MESSAGE), []);
            }
        });

        await pendingRef.current;
    }
    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        newBotMessage,
                        requestCompletionMessage
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
