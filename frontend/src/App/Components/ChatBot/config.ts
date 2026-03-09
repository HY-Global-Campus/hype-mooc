import { createChatBotMessage } from 'react-chatbot-kit';
const config = {
	initialMessages: [createChatBotMessage(`Hello! I am your ILO assistant and I am here to help you.`, {})],
	botName: 'Madida',
	state: {
		gptChatHistory: [],
	}
};

export default config;
