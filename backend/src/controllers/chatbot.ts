import axios, { AxiosResponse } from "axios";
import express from "express"
import config from "../config.js";

interface CompletionRequest {
    messages: Message[];
}

interface Message {
    role: string;
    content: string;

}

interface CompletionReponse {
    id: string;
    created: number;
    choised: Choice[];
}

interface Choice {
    finish_reason: string;
    index: number;
    messages: Message[];
}



const madidaPromtContent: string = `Help user with their intended learning objectives (ILO)`;

const madidaPrompt: Message = {
    role: 'system',
    content: madidaPromtContent,
}

const getCompletion = async (data: CompletionRequest): Promise<CompletionReponse> => {
    try {
        data.messages.unshift(madidaPrompt);
        const url = `${config.GCAI_URL}/api/chat`;
        const response: AxiosResponse<CompletionReponse> = await axios.post<CompletionReponse>(url, data, {
            headers: {
                authorization: `Bearer ${config.GCAI_TOKEN}`,
            }
        });

        return response.data;
    } catch (error) {
        {
            if (axios.isAxiosError(error)) {
                console.error('Error with Axios:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }

    }
}



const chatbotRouter = express.Router();

chatbotRouter.post('/completion', async (req, res) => {
    const requestData: CompletionRequest = req.body;
    const response = await getCompletion(requestData);
    res.json(response);
})


export default chatbotRouter
