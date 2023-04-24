import { Col, message, Row, Checkbox, Button, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../Style/Home.css';
import '../Style/Site.css';
import { SendOutlined } from '@ant-design/icons';
import { useStateCallback } from '../Hooks/useStateCallback';
import MsgItemGroup from '../Components/MsgItemGroup';
import { changeKeepSession } from '../Api/OpenAI';
import UpdatePrompt from '../Components/UpdatePrompt';
import SmartInputHit from '../Components/SmartInputHit';
import SmartInputSql from '../Components/SmartInput/SmartInputSQL';
import SmartInputTransfer from '../Components/SmartInput/SmartInputTransfer';

const { useToken } = theme;

const Home = () => {
    const { token } = useToken();

    //#region 常量的Key Code
    const ENTER_KEY = 'Enter';
    const UP_KEY = 'ArrowUp';
    const ESC_KEY = 'Escape';
    const SMART_HOT_KEY_EN = '/';
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

    const [showSmartInputSql, setShowSmartInputSql] = useState(false);

    const [showSmartInputTransfer, setShowSmartInputTransfer] = useState(false);

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
            if (
                (elem.id && elem.id === 'search-msg-history') ||
                elem.id === 'smart-input-hit' ||
                elem.id === 'smart-input-sql' ||
                elem.id === 'smart-input-transfer'
            ) {
                return;
            }
            elem = elem.parentNode;
        }
        setShowSmartInputHit(false);
        setShowHistoryDialog(false);
        setShowSmartInputSql(false);
        setShowSmartInputTransfer(false);
    };

    return (
        <div
            style={{
                position: 'relative',
                backgroundColor: token.colorBgLayout,
            }}
        >
            <div className="flex-col" style={{ height: '100vh' }}>
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

                <div
                    id="input-panel"
                    style={{
                        padding: `${token.padding}px 0`,
                        borderTop: `1px solid ${token.colorBorder}`,
                        backgroundColor: token.colorBgContainer,
                        boxShadow: token.boxShadow,
                    }}
                >
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
                                    submit={(item) => {
                                        switch (item) {
                                            case 'create_sql':
                                                setShowSmartInputSql(true);
                                                break;
                                            case 'transfer':
                                                setShowSmartInputTransfer(true);
                                                break;
                                        }
                                    }}
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
                                        style={{
                                            backgroundColor: token.colorBgContainer,
                                            color: token.colorText,
                                            border: `2px solid ${token.colorBorder}`,
                                            borderRadius: token.borderRadius,
                                            fontSize: token.fontSizeLG,
                                            lineHeight: token.lineHeight,
                                        }}
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
                                            if (e.key === SMART_HOT_KEY_EN && e.ctrlKey) {
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
                                                    color: token.colorText,
                                                }}
                                            />
                                        }
                                    />
                                </div>

                                <div style={{ marginTop: token.margin, textAlign: 'right' }}>
                                    <Checkbox
                                        style={{ color: token.colorText }}
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

            <UpdatePrompt />

            <SmartInputSql
                isShow={showSmartInputSql}
                onSubmit={(content) => {
                    setMsg(content);
                    setShowSmartInputSql(false);
                    setSearchInputFocus();
                }}
                onCancel={() => {
                    setShowSmartInputSql(false);
                    setSearchInputFocus();
                }}
            />

            <SmartInputTransfer
                isShow={showSmartInputTransfer}
                onSubmit={(content) => {
                    setMsg(content);
                    setShowSmartInputTransfer(false);
                    setSearchInputFocus();
                }}
                onCancel={() => {
                    setShowSmartInputTransfer(false);
                    setSearchInputFocus();
                }}
            />

            <div
                id="footer"
                style={{
                    backgroundColor: token.colorBgLayout,
                    color: token.colorText,
                    padding: token.padding,
                    lineHeight: token.lineHeightLG,
                }}
            >
                Design by: Jiahao Cao. Power by: OpenAI API. Model: gpt-3.5-turbo
                <div style={{ marginTop: 6 }} />
                Copyright © 2023 Jiahao Cao. All rights reserved.
            </div>
        </div>
    );
};
export default Home;
