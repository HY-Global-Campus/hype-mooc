import api from './axiosInstance';

export interface CompletionRequest {
    messages: Message[];
}

export interface Message {
    role: string;
    content: string;

}

export interface CompletionReponse {
    id: string;
    created: number;
    choices: Choice[];
}

export interface Choice {
    finish_reason: string;
    index: number;
    messages: Message[];
}

/**
 * Milliseconds a completion may take before it is abandoned.
 *
 * Generous, because nothing streams and a long reply is slow — but bounded: completions run
 * one at a time, so a request that never settles would block every later message.
 */
const COMPLETION_TIMEOUT_MS = 60_000;

export const getCompletion = async (request: CompletionRequest): Promise<CompletionReponse> => {
    const response = await api.post<CompletionReponse>('/chatbot/completion', request, {
        timeout: COMPLETION_TIMEOUT_MS,
    });
    return response.data;
}
