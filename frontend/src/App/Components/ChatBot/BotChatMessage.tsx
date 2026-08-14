import type { ReactNode } from 'react';
import Markdown from 'react-markdown';

/**
 * Message content that makes a bot bubble show the typing indicator instead of text.
 *
 * ActionProvider pushes a bot message carrying this exact content while a completion
 * request is in flight and drops it once the reply — or an error — lands. The leading NUL
 * keeps it unreachable as model output, so a real reply can never render as a spinner.
 */
export const TYPING_INDICATOR_MESSAGE = '\u0000chatbot-typing';

interface BotChatMessageProps {
  message: string;
  loader: ReactNode;
}

/**
 * Bot chat bubble: renders the model's reply as Markdown, or the library's animated dots
 * when the message is `TYPING_INDICATOR_MESSAGE`.
 *
 * Wired in via `customComponents.botChatMessage`, which react-chatbot-kit calls with only
 * `{ message, loader }` — no `loading` flag, hence the sentinel.
 *
 * Keep it free of raw-HTML plugins: model output must not inject markup into the page.
 */
const BotChatMessage = ({ message, loader }: BotChatMessageProps) => {
  if (message === TYPING_INDICATOR_MESSAGE) {
    return (
      <div
        className="react-chatbot-kit-chat-bot-message chatbot-typing"
        role="status"
        aria-label="The assistant is typing"
      >
        {loader}
      </div>
    );
  }

  return (
    <div className="react-chatbot-kit-chat-bot-message">
      <div className="chatbot-markdown">
        <Markdown>{message}</Markdown>
      </div>
    </div>
  );
};

export default BotChatMessage;
