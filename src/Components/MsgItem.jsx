import { Col, Row, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useStateCallback } from '../hooks/useStateCallback';
import MsgContent from './MsgContent';
import '../Style/MsgItem.css';
import { chatApi } from '../Api/OpenAI';

/**
 * 消息对象
 * @param {参数} props
 * @returns
 */
const MsgItem = (props) => {
    const [msg, setMsg] = useStateCallback('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.isUser) {
            setMsg(props.msg, () => props.scrollToBottom());
        } else {
            askChatGPT(props.msg);
        }
    }, [props.isUser]);

    /**
     * 向ChatGPT提问
     * @param {提问内容} content
     */
    function askChatGPT(content) {
        setLoading(true);
        chatApi(content)
            .then((res) => {
                setMsg(res.data.choices[0].message.content, () => props.unlock());
            })
            .finally(() => setLoading(false));
    }

    return (
        <div
            className="msg-item-root"
            style={{ padding: '12px 0', backgroundColor: props.isUser ? '#fff' : '#f5f5f5' }}
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
                    <div>
                        <Space>
                            <div className="sender-name ">
                                {props.isUser ? 'Your' : 'ChatGPT AI'}
                            </div>
                        </Space>

                        <div className="flex-row">
                            {/* 侧边柱条 */}
                            <div className={props.isUser ? 'left-bar-user' : 'left-bar-chatGPT'} />

                            {/* 渲染消息体 */}
                            <div className="flex-fill">
                                <Skeleton loading={loading} active>
                                    <MsgContent
                                        content={msg}
                                        refreshView={() => props.scrollToBottom()}
                                    />
                                </Skeleton>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default MsgItem;
