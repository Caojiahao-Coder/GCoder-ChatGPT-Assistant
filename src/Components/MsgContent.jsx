import { message, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useStateCallback } from '../hooks/useStateCallback';
import '../Style/MsgContent.css';
import { EditOutlined } from '@ant-design/icons';

/**
 * 使用Markdown来渲染的消息体 组件
 */
const MsgContent = (props) => {
    const [content, setContent] = useStateCallback('');

    const [lockEdit, setLockEdit] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setContent(props.content, () => props.refreshView());
        setLockEdit(props.lockInput);
        window.removeEventListener('click', onViewClick);
        window.addEventListener('click', onViewClick);
        return () => {
            window.removeEventListener('click', onViewClick);
        };
    }, [props.content, props.lockInput]);

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
        <div id="msg-content-root">
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
                    <div className="tool-item">
                        <Tooltip title="编辑当前会话内容">
                            <EditOutlined id="chat-edit" onClick={() => setIsEdit(true)} />
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
    );
};
export default MsgContent;
