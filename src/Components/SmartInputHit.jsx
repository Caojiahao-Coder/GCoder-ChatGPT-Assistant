import { useEffect, useState } from 'react';
import { theme } from 'antd';
import '../Style/SmartInputHit.css';
import EnableSelectList from './EnableSelectList';
const { useToken } = theme;

const SmartInputHit = (props) => {
    const { token } = useToken();

    const [show, setIsShow] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setIsShow(props.show);
        setDataSource(props.dataSource);
    }, [props.show, props.dataSource]);

    return (
        <div
            id="smart-input-hit"
            style={{ backgroundColor: token.colorBgContainer, boxShadow: token.boxShadow }}
            className={show ? 'show' : 'hide'}
        >
            <div
                id="smart-input-hit-title"
                style={{
                    backgroundColor: token.colorBgContainer,
                    color: token.colorText,
                    padding: token.padding,
                    borderTopLeftRadius: token.borderRadius,
                    borderTopRightRadius: token.borderRadius,
                }}
            >
                {props.title}
            </div>
            <div id="smart-input-hit-content">
                <EnableSelectList
                    dataSource={dataSource}
                    isShow={show}
                    onCancel={() => props.onCancel()}
                    submitCallback={(value) => {
                        props.submit(value);
                        props.onCancel();
                    }}
                />
            </div>
        </div>
    );
};
export default SmartInputHit;
