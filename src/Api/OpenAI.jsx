import axios from 'axios';
import { MODEL_ID, OPENAI_KEY } from '../config';

//历史消息列表
let msgHistoryList = [];

//标记是否进行持久化Session
let keepSession =
    localStorage.getItem('keepSession') == null
        ? false
        : String(localStorage.getItem('keepSession')) === 'true';

/**
 * 维护和生成messages
 * @param {新的聊天内容} content
 * @param {当前问题的缩影} index
 * @returns
 */
function generateChatData(content, index) {
    if (!keepSession) {
        //fix：chat gpt 需要传入的是一个数组Msg 2023年3月22日
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

    //使用index进行数据标引，如果index为-1 说明当前的聊天内容为全新的，那么我们直接追加就可以了。
    if (index === -1) {
        msgHistoryList.push({
            role: 'user',
            content: content,
        });
    } else {
        //如果当前不是添加新的聊天命令，我们就需要对之前的内容进行相对应的修改
        index = index * 2;
        msgHistoryList[index] = {
            role: 'user',
            content: content,
        };
    }

    //请求实体数据
    var data = {
        model: MODEL_ID,
        messages: index === -1 ? msgHistoryList : msgHistoryList.slice(0, index + 1),
        temperature: 0.6,
    };

    return data;
}

/**
 * OpenAI 的 chat Api接口
 * @param {提问的问题} content
 * @returns
 */
export const chatApi = (content, index) =>
    axios.post('https://api.openai.com/v1/chat/completions', generateChatData(content, index), {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            Authorization: `Bearer ${OPENAI_KEY}`,
        },
        // 60 * 1s * 10
        timeout: 1000 * 60 * 10,
    });

/**
 * 切换是否进行持久化Session会话
 * @returns
 */
export const changeKeepSession = () => {
    keepSession = !keepSession;
    if (!keepSession) {
        msgHistoryList = [];
    }
};

/**
 * 添加AI的回答内容
 * @param {回答内容} content
 */
export const addAIAnswer = (content, index) => {
    if (!keepSession) return;

    if (index === -1) {
        msgHistoryList.push({
            role: 'assistant',
            content: content,
        });
    } else {
        msgHistoryList[index + 1] = {
            role: 'assistant',
            content: content,
        };
    }
};
