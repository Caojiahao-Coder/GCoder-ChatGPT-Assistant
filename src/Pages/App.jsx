import { Col, message, Row, Spin, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import '../Style/App.css';
import '../Style/Site.css';
import { useStateCallback } from '../hooks/useStateCallback';
import MsgItemGroup from '../Components/MsgItemGroup';
import { changeKeepSession } from '../Api/OpenAI';
import UpdatePrompt from '../Components/UpdatePrompt';

const App = () => {
    //#region 常量的Key Code
    const ENTER_KEY = 'enter';
    const UP_KEY = 'arrowup';
    //#endregion

    //存储当前用户输入的Msg
    const [msg, setMsg] = useStateCallback('');

    //当前的Msg列表
    const [msgList, setMsgList] = useStateCallback([]);

    //判断ChatGPT是否在生成回答 如果在生成回答我们就需要限制提交新的回答
    const [isLock, setIsLock] = useState(false);

    //搜索历史
    const [msgInputHistory, setMsgInputHistory] = useState([]);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);

    /**
     * 当点击History Item
     */
    function onClickMsgHistory(msgContent) {
        //设置搜索内容
        setMsg(msgContent);
        setShowHistoryDialog(false);
    }

    /**
     * 发送Msg
     * @returns
     */
    function sendMsg() {
        if (msg.trim().length === 0) {
            message.warning('抱歉，你的提问内容不可以为空.');
            return;
        }

        setShowHistoryDialog(false);

        //记录搜索历史
        recordSearchHistory(msg);

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
     * 记录搜索历史
     */
    function recordSearchHistory(content) {
        const history = msgInputHistory.concat();
        history.push(content);
        const distinctList = [...new Set(history)];
        setMsgInputHistory(distinctList);
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

    //得到消息列表
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
                                <div
                                    id="search-msg-history"
                                    style={{ display: showHistoryDialog ? 'block' : 'none' }}
                                >
                                    <div id="search-msg-history-title">历史搜索</div>
                                    <ul>
                                        {msgInputHistory.map((item, index) => (
                                            <li key={index} onClick={() => onClickMsgHistory(item)}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <input
                                    autoComplete="off"
                                    id="msg-input"
                                    type="text"
                                    disabled={isLock}
                                    placeholder={isLock ? 'ChatGPT-Thinking...' : '@ChatGPT-Msg'}
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    onKeyUp={(e) => {
                                        const keyCode = e.key.toLowerCase();
                                        //回车开始搜索
                                        if (keyCode === ENTER_KEY) sendMsg();

                                        //上键显示搜索历史
                                        if (keyCode === UP_KEY) {
                                            setShowHistoryDialog(true);
                                        }
                                    }}
                                />
                                <Spin
                                    style={{ position: 'absolute', top: 11, right: 12 }}
                                    spinning={isLock}
                                />

                                <div style={{ marginTop: 8, textAlign: 'right' }}>
                                    <Checkbox
                                        defaultChecked={true}
                                        onChange={(e) => {
                                            setMsgList([], () => scrollToBottom());
                                            changeKeepSession(e.target.checked);
                                        }}
                                    >
                                        启用持续性Session会话模式
                                    </Checkbox>
                                </div>
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

            <UpdatePrompt />
        </div>
    );
};
export default App;
