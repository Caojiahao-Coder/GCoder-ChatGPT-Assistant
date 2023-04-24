import { message, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../../Style/SmartInput/SmartInputSql.css';
const { useToken } = theme;

/**
 *
 * @returns
 */
const SmartInputSql = (props) => {
    const { token } = useToken();

    const [isShow, setIsShow] = useState(false);

    const nameRef = useRef();
    const descRef = useRef();
    const paramsRef = useRef();

    useEffect(() => {
        setIsShow(props.isShow);

        if (props.isShow) {
            setTimeout(() => {
                nameRef.current.value = '';
                descRef.current.value = '';
                paramsRef.current.value = '';
                nameRef.current.focus();
            }, 100);
        } else {
            setTimeout(() => {
                nameRef.current.value = '';
                descRef.current.value = '';
                paramsRef.current.value = '';
            }, 100);
        }
    }, [props.isShow]);

    const onInputKeyDown = (e) => {
        const targetId = e.target.id;
        const targetValue = e.target.value;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                nextInput(targetId, targetValue);
                break;
            case 'Escape':
                e.preventDefault();
                props.onCancel();
                break;
        }
    };

    function nextInput(targetId, targetValue) {
        switch (targetId) {
            case 'input-name':
                if (targetValue.trim().length === 0) {
                    message.info('抱歉，该字段为必要属性.');
                    return;
                }
                if (descRef.current) {
                    descRef.current.focus();
                }
                break;
            case 'input-desc':
                if (targetValue.trim().length === 0) {
                    message.info('抱歉，该字段为必要属性.');
                    return;
                }
                if (paramsRef.current) {
                    paramsRef.current.focus();
                }
                break;
            case 'input-params':
                generateMsgContent();
                break;
        }
    }

    /**
     * 生成消息信息
     */
    function generateMsgContent() {
        let content = `帮我使用T-SQL生成一张名为：${nameRef.current.value},并且${descRef.current.value}`;
        if (paramsRef.current.value.trim().length > 0) {
            content += `,以及${paramsRef.current.value}`;
        }
        if (props.onSubmit) props.onSubmit(content);
    }

    return (
        <div
            id="smart-input-sql"
            style={{
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadius,
                boxShadow: token.boxShadow,
            }}
            className={isShow ? 'show' : 'hide'}
        >
            <div
                id="smart-input-sql-title"
                style={{ padding: token.padding, color: token.colorText }}
            >
                智能生成SQL
            </div>

            <div>
                <div className="smart-input-sql-editor" style={{ paddingTop: 0 }}>
                    <span style={{ color: token.colorText }}>表名称：</span>
                    <input
                        id="input-name"
                        autoComplete="off"
                        ref={nameRef}
                        className="smart-input-sql-input"
                        onKeyDown={onInputKeyDown}
                        style={{
                            color: token.colorText,
                            backgroundColor: token.colorBgContainer,
                            border: `1px solid ${token.colorBorder}`,
                        }}
                        placeholder="Table Name"
                    />
                </div>
                <div className="smart-input-sql-editor">
                    <span style={{ color: token.colorText }}>包含属性：</span>
                    <input
                        id="input-desc"
                        autoComplete="off"
                        ref={descRef}
                        className="smart-input-sql-input"
                        onKeyDown={onInputKeyDown}
                        style={{
                            color: token.colorText,
                            backgroundColor: token.colorBgContainer,
                            border: `1px solid ${token.colorBorder}`,
                        }}
                        placeholder="包含常见属性"
                    />
                </div>
                <div className="smart-input-sql-editor">
                    <span style={{ color: token.colorText }}>附加要求：</span>
                    <textarea
                        id="input-params"
                        autoComplete="off"
                        onKeyDown={onInputKeyDown}
                        ref={paramsRef}
                        placeholder="其中ID需要为自增加模式"
                        style={{
                            color: token.colorText,
                            backgroundColor: token.colorBgContainer,
                            border: `1px solid ${token.colorBorder}`,
                        }}
                        className="smart-input-sql-input smart-input-sql-textarea"
                    />
                </div>
            </div>

            <div id="smart-input-sql-desc">
                请输入 <span>Enter</span> 进行提交, <span>Esc</span> 可取消输入
            </div>
        </div>
    );
};
export default SmartInputSql;
