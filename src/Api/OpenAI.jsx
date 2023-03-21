import axios from 'axios';
import { MODEL_ID, OPENAI_KEY } from '../config';

function generateChatData(content) {
    var data = {
        model: MODEL_ID,
        messages: [
            {
                role: 'user',
                content: content,
            },
        ],
        temperature: 0.6,
    };

    return data;
}

/**
 * OpenAI 的 chat Api接口
 * @param {提问的问题} content
 * @returns
 */
export const chatApi = (content) =>
    axios.post('https://api.openai.com/v1/chat/completions', generateChatData(content), {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            Authorization: 'Bearer ' + OPENAI_KEY,
        },
        // 120 * 1s
        timeout: 1000 * 120,
    });
