import Markdown from 'react-markdown';

interface BotChatMessageProps {
  message: string;
}

/**
 * Bot chat bubble that renders the model's reply as Markdown.
 *
 * Wired in via `customComponents.botChatMessage`, which react-chatbot-kit calls with
 * only `{ message, loader }` — no `loading` flag, so the reply appears immediately
 * instead of behind the library's 750 ms typing loader.
 *
 * Keep it free of raw-HTML plugins: model output must not inject markup into the page.
 */
const BotChatMessage = ({ message }: BotChatMessageProps) => (
  <div className="react-chatbot-kit-chat-bot-message">
    <div className="chatbot-markdown">
      <Markdown>{message}</Markdown>
    </div>
  </div>
);

export default BotChatMessage;
