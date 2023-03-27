const FeatureItem = (props) => {
    return (
        <div className="feature-item">
            <div className={props.done ? 'done-item done' : 'done-item'}></div>
            <div className="feature-content">{props.content}</div>
        </div>
    );
};
export default FeatureItem;
