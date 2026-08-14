import { createChatBotMessage } from 'react-chatbot-kit';
import BotChatMessage from './BotChatMessage';

const config = {
	initialMessages: [createChatBotMessage(`Hello! I am your ILO assistant and I am here to help you.`, {})],
	botName: 'Madida',
	state: {
		gptChatHistory: [],
	},
	customComponents: {
		botChatMessage: BotChatMessage,
	}
};

export default config;
