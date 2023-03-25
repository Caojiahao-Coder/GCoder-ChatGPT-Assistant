import { Col, message, Row, Spin, Checkbox, Space, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../Style/App.css';
import '../Style/Site.css';
import { SendOutlined } from '@ant-design/icons';
import { useStateCallback } from '../Hooks/useStateCallback';
import MsgItemGroup from '../Components/MsgItemGroup';
import { changeKeepSession } from '../Api/OpenAI';
import UpdatePrompt from '../Components/UpdatePrompt';
import SmartInputHit from '../Components/SmartInputHit';

const App = () => {
    //#region 常量的Key Code
    const ENTER_KEY = 'Enter';
    const UP_KEY = 'ArrowUp';
    const ESC_KEY = 'Escape';
    const SMART_HOT_KEY_EN = '/';
    const SMART_HOT_KEY_CN = 229;
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

    //智能搜索框
    const [showSmartInputHit, setShowSmartInputHit] = useState(false);

    //输入框的Ref
    const searchRef = useRef();

    /**
     * 当点击History Item
     */
    function onClickMsgHistory(msgContent) {
        //设置搜索内容
        setMsg(msgContent);
        setShowHistoryDialog(false);
        setSearchInputFocus();
    }

    /**
     * 设置搜索输入的焦点
     */
    function setSearchInputFocus() {
        if (searchRef.current) searchRef.current.focus();
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

        window.removeEventListener('click', onOtherViewClick);
        window.addEventListener('click', onOtherViewClick);
        return () => {
            window.removeEventListener('click', onOtherViewClick);
        };
    }, []);

    const onOtherViewClick = (e) => {
        var elem = e.target;
        while (elem) {
            if ((elem.id && elem.id === 'search-msg-history') || elem.id === 'smart-input-hit') {
                return;
            }
            elem = elem.parentNode;
        }
        setShowSmartInputHit(false);
        setShowHistoryDialog(false);
    };

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

                <div id="input-panel" style={{ padding: '16px 0', borderTop: '1px solid #f1f1f1' }}>
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
                                <SmartInputHit
                                    title="搜索历史记录"
                                    dataSource={function () {
                                        const list = [];
                                        msgList.forEach((element) => {
                                            list.push({
                                                value: element.msg,
                                                item: element.msg,
                                            });
                                        });
                                        return list;
                                    }}
                                    show={showHistoryDialog}
                                    submit={(item) => onClickMsgHistory(item)}
                                    onCancel={() => {
                                        setShowHistoryDialog(false);
                                        setSearchInputFocus();
                                    }}
                                />

                                <SmartInputHit
                                    title="智能输入提示"
                                    dataSource={function () {
                                        return [
                                            {
                                                value: 'transfer',
                                                item: '翻译',
                                            },
                                            {
                                                value: 'create_sql',
                                                item: '创建Sql',
                                            },
                                        ];
                                    }}
                                    show={showSmartInputHit}
                                    submit={(item) => message.info('智能输入功能都在输入中...')}
                                    onCancel={() => {
                                        setShowSmartInputHit(false);
                                        setSearchInputFocus();
                                    }}
                                />

                                <div className="flex-row">
                                    <input
                                        id="msg-input"
                                        ref={searchRef}
                                        className="flex-fill"
                                        autoComplete="off"
                                        type="text"
                                        disabled={isLock}
                                        placeholder={
                                            isLock ? 'ChatGPT-Thinking...' : '@ChatGPT - Message'
                                        }
                                        value={msg}
                                        onChange={(e) => setMsg(e.target.value)}
                                        onKeyDown={(e) => {
                                            //回车开始搜索
                                            if (e.key === ENTER_KEY) {
                                                e.preventDefault();
                                                setShowHistoryDialog(false);
                                                setShowSmartInputHit(false);
                                                sendMsg();
                                            }

                                            //上键显示搜索历史
                                            if (e.key === UP_KEY) {
                                                e.preventDefault();
                                                setShowSmartInputHit(false);
                                                setShowHistoryDialog(true);
                                            }

                                            //ESC取消搜索历史提示
                                            if (e.key === ESC_KEY) {
                                                e.preventDefault();
                                                setShowHistoryDialog(false);
                                                setShowSmartInputHit(false);
                                                setSearchInputFocus();
                                            }

                                            //显示智能输入框
                                            if (e.key === SMART_HOT_KEY_EN) {
                                                e.preventDefault();
                                                setShowHistoryDialog(false);
                                                setShowSmartInputHit(true);
                                            }
                                        }}
                                    />

                                    <Button
                                        id="btn-send"
                                        size="large"
                                        type="text"
                                        loading={isLock}
                                        onClick={() => sendMsg()}
                                        icon={
                                            <SendOutlined
                                                id="send-icon"
                                                style={{
                                                    lineHeight: '30px',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        }
                                    />
                                </div>

                                <div style={{ marginTop: 8, textAlign: 'right' }}>
                                    <Checkbox
                                        defaultChecked={
                                            localStorage.getItem('keepSession') === null
                                                ? false
                                                : String(localStorage.getItem('keepSession')) ===
                                                  'true'
                                        }
                                        onChange={(e) => {
                                            localStorage.setItem('keepSession', e.target.checked);
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
