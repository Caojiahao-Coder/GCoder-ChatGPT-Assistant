import { message, Tag, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../../Style/SmartInput/SmartInputTransfer.css';
const { useToken } = theme;

/**
 * 翻译智能输入翻译
 * @returns
 */
const SmartInputTransfer = (props) => {
    const { token } = useToken();

    const [show, setShow] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        setShow(props.isShow);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.value = '';
                if (props.isShow) {
                    inputRef.current.focus();
                }
            }
        }, 100);
    }, [props.isShow]);

    const onKeyDown = (e) => {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                const value = inputRef.current.value;
                if (value.trim().length === 0) {
                    message.info('请输入你要翻译的内容后重新尝试');
                } else {
                    props.onSubmit(generateMsgContent(inputRef.current.value));
                }
                break;
            case 'Escape':
                e.preventDefault();
                props.onCancel();
                break;
        }
    };

    function generateMsgContent(value) {
        const content = `请帮我将下面的文本：‘${value}’翻译一下.`;
        return content;
    }

    return (
        <div
            id="smart-input-transfer"
            style={{
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadius,
                boxShadow: token.boxShadow,
            }}
            className={show ? 'show' : 'hide'}
        >
            <div
                id="smart-input-transfer-title"
                style={{ padding: token.padding, color: token.colorText }}
            >
                智能单词翻译
            </div>
            <textarea
                ref={inputRef}
                placeholder="请输入你要翻译的内容"
                onKeyDown={onKeyDown}
                style={{
                    padding: `0px ${token.padding}px ${token.padding}px ${token.padding}px`,
                    color: token.colorText,
                    backgroundColor: token.colorBgContainer,
                    border: 0,
                }}
            />
            <div id="smart-input-transfer-desc" style={{ color: token.colorText }}>
                请输入 <span style={{ color: 'black' }}>Enter</span> 进行提交,{' '}
                <span style={{ color: 'black' }}>Esc</span> 可取消输入
            </div>
        </div>
    );
};

export default SmartInputTransfer;
