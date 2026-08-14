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

    const newBotMessage = (message: string) => {
        const botMessage = createChatBotMessage(message);
        setState((prev) => ({...prev, messages: [...prev.messages, botMessage], }));
    }

    const requestCompletionMessage = async (message: string )=> {
        const newMessage: chatbotService.Message = {
            content: message,
            role: 'user'
        }
        const typingIndicator = createChatBotMessage(TYPING_INDICATOR_MESSAGE);
        setState((prev) => ({...prev, messages: [...prev.messages, typingIndicator]}));

        // Dropping the indicator by id, not by position, keeps overlapping requests from
        // removing each other's.
        const replaceIndicator = (reply: ChatMessage, historyTurns: chatbotService.Message[]) => {
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages.filter((m) => m.id !== typingIndicator.id), reply],
                gptChatHistory: [...prev.gptChatHistory, ...historyTurns]
            }));
        }

        try {
            const response = await chatbotService.getCompletion({messages: [...state.gptChatHistory, newMessage]});
            const reply = response.choices?.[0]?.messages?.[0]?.content;
            if (!reply) {
                throw new Error('Completion response carried no message');
            }
            const botMessageForHistory: chatbotService.Message = {
                content: reply,
                role: 'assistant'
            }
            replaceIndicator(createChatBotMessage(reply), [newMessage, botMessageForHistory]);
        } catch (error) {
            console.error('Chatbot completion failed', error);
            replaceIndicator(createChatBotMessage(REQUEST_FAILED_MESSAGE), []);
        }
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
