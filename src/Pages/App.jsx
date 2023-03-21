import { Col, message, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import MsgItem from '../Components/MsgItem';
import '../Style/App.css';
import '../Style/Site.css';
import { useStateCallback } from '../hooks/useStateCallback';
import CompoundedSpace from 'antd/es/space';
import MsgItemGroup from '../Components/MsgItemGroup';

const App = () => {
    //存储当前用户输入的Msg
    const [msg, setMsg] = useState('');

    //当前的Msg列表
    const [msgList, setMsgList] = useStateCallback([]);

    //判断ChatGPT是否在生成回答 如果在生成回答我们就需要限制提交新的回答
    const [isLock, setIsLock] = useState(false);

    //发送Msg
    function sendMsg() {
        if (msg.trim().length === 0) {
            message.warning('抱歉，你的提问内容不可以为空.');
            return;
        }

        setIsLock(true);
        let list = msgList.concat();
        //推送用户提问的Msg
        list.push({
            isUser: true,
            msg: msg,
        });
        setMsg('');
        setMsgList(list, () => scrollToBottom());
    }

    /**
     * 解锁输入框
     */
    function unlockInput() {
        setIsLock(false);
        scrollToBottom();
    }

    /**
     * 开始新的搜索限制其输入
     */
    function lockInput() {
        setIsLock(true);
        scrollToBottom();
    }

    /**
     * 将div滚动到最底部
     */
    function scrollToBottom() {
        if (divTarget) divTarget.scrollTop = divTarget.scrollHeight;
    }

    var divTarget = document.getElementById('msg-list');

    useEffect(() => {
        if (!divTarget) divTarget = document.getElementById('msg-list');
        //监听Div的高度变化
        new ResizeObserver(scrollToBottom).observe(divTarget);
    }, []);

    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <div className="flex-col" style={{ height: '100%' }}>
                <div id="msg-list">
                    {msgList.map((item, index) => (
                        <div key={index}>
                            <MsgItemGroup
                                index={index}
                                msg={item.msg}
                                unlock={() => unlockInput()}
                                lock={() => lockInput()}
                                scrollToBottom={() => scrollToBottom()}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ padding: '16px 0', borderTop: '1px solid #f1f1f1' }}>
                    <Row gutter={24} style={{ margin: 0 }}>
                        <Col
                            xs={{ span: 24, offset: 0 }}
                            sm={{ span: 24, offset: 0 }}
                            md={{ span: 24, offset: 0 }}
                            lg={{ span: 16, offset: 4 }}
                            xl={{ span: 18, offset: 3 }}
                            xxl={{ span: 18, offset: 3 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="msg-input"
                                    type="text"
                                    disabled={isLock}
                                    placeholder={isLock ? 'ChatGPT-Thinking...' : '@ChatGPT-Msg'}
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    onKeyUp={(e) => {
                                        const keyCode = e.key.toLowerCase();
                                        if (keyCode === 'enter') sendMsg();
                                    }}
                                />
                                <Spin
                                    style={{ position: 'absolute', top: 11, right: 12 }}
                                    spinning={isLock}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <div id="footer">
                Design by: Jiahao Cao. Power by: OpenAI API. Model: gpt-3.5-turbo
                <div style={{ marginTop: 6 }} />
                Copyright © Jiahao Cao.
            </div>
        </div>
    );
};
export default App;
