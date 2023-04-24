import { message, Space, Tooltip, theme } from 'antd';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useStateCallback } from '../Hooks/useStateCallback';
import '../Style/MsgContent.css';
import { EditOutlined, FrownOutlined } from '@ant-design/icons';
const { useToken } = theme;

/**
 * 使用Markdown来渲染的消息体 组件
 */
const MsgContent = (props) => {
    const { token } = useToken();

    const [content, setContent] = useStateCallback('');

    const [lockEdit, setLockEdit] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        setContent(props.content, () => props.refreshView());
        setLockEdit(props.lockInput);
        setIsFailed(props.isFailed);
        window.removeEventListener('click', onViewClick);
        window.addEventListener('click', onViewClick);
        return () => {
            window.removeEventListener('click', onViewClick);
        };
    }, [props.content, props.lockInput, props.isFailed]);

    const onViewClick = (e) => {
        var elem = e.target;
        while (elem) {
            if ((elem.id && elem.id === 'chat-content-edit') || elem.id === 'chat-edit') {
                return;
            }
            elem = elem.parentNode;
        }
        setContent(props.content);
        setIsEdit(false);
    };

    function reloadMsg() {
        props.onReloadMsg(content);
    }

    return (
        <>
            {isFailed ? (
                <Space>
                    <div id="failed-content">Request failed.</div>
                    <FrownOutlined style={{ color: '#ff4d4f', fontSize: '10px' }} />
                </Space>
            ) : (
                <div
                    id="msg-content-root"
                    style={{ color: token.colorText, lineHeight: token.lineHeight }}
                >
                    {isEdit ? (
                        <></>
                    ) : (
                        <ReactMarkdown
                            children={content}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            children={String(children).replace(/\n$/, '')}
                                            style={vs}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        />
                    )}

                    {props.isUser && !lockEdit ? (
                        <Space id="content-tools">
                            <div className="tool-item" style={{ marginTop: isEdit ? 7 : 0 }}>
                                <Tooltip title="编辑当前会话内容">
                                    <EditOutlined
                                        id="chat-edit"
                                        color={token.colorText}
                                        onClick={() => setIsEdit(true)}
                                    />
                                </Tooltip>
                            </div>
                        </Space>
                    ) : (
                        <></>
                    )}

                    {isEdit ? (
                        <input
                            id="chat-content-edit"
                            value={content}
                            style={{
                                color: token.colorText,
                                backgroundColor: token.colorBgContainer,
                                border: `1px solid ${token.colorBorder}`,
                                borderRadius: token.borderRadius,
                            }}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={(e) => {
                                const keyCode = e.key.toString().toLowerCase();
                                if (keyCode === 'enter') {
                                    setIsEdit(false);
                                    if (content.trim().length === 0) {
                                        message.warning('抱歉，问题不可以为空。');
                                        setContent(props.content, () => reloadMsg());
                                    } else reloadMsg();
                                } else if (keyCode === 'escape') {
                                    setIsEdit(false);
                                    setContent(props.content);
                                }
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </>
    );
};
export default MsgContent;
