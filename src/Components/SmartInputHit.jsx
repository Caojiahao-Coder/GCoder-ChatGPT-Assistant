import { useEffect, useState } from 'react';
import '../Style/SmartInputHit.css';
import EnableSelectList from './EnableSelectList';

const SmartInputHit = (props) => {
    const [show, setIsShow] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setIsShow(props.show);
        setDataSource(props.dataSource);
    }, [props.show, props.dataSource]);

    return (
        <div id="smart-input-hit" className={show ? 'show' : 'hide'}>
            <div id="smart-input-hit-title">{props.title}</div>
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
