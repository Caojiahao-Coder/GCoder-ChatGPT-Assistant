import { useEffect, useState } from 'react';
import MsgItem from './MsgItem';

const MsgItemGroup = (props) => {
    const [msg, setMsg] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMsg(props.msg);
    }, [props.msg]);

    return (
        <div key={props.index}>
            <MsgItem
                index={'user-' + props.index}
                isUser={true}
                loading={loading}
                msg={msg}
                scrollToBottom={() => props.scrollToBottom()}
                onReloadMsg={(msg) => setMsg(msg)}
            />

            <MsgItem
                index={'gpt-' + props.index}
                isUser={false}
                msg={msg}
                unlock={() => {
                    setLoading(false);
                    props.unlock();
                }}
                scrollToBottom={() => props.scrollToBottom()}
                lock={() => {
                    setLoading(true);
                    props.lock();
                }}
            />
        </div>
    );
};

export default MsgItemGroup;
