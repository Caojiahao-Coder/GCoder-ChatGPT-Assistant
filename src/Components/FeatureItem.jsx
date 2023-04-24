import { theme } from 'antd';
const { useToken } = theme;

const FeatureItem = (props) => {
    const { token } = useToken();

    return (
        <div className="feature-item">
            <div
                style={{ boxShadow: token.boxShadow, border: `2px solid ${token.colorBorder}` }}
                className={props.done ? 'done-item done' : 'done-item'}
            ></div>
            <div className="feature-content">{props.content}</div>
        </div>
    );
};
export default FeatureItem;
