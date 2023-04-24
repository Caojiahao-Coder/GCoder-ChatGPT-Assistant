import { Space, theme } from 'antd';
import { useEffect, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
const { useToken } = theme;

const UpdateItem = (props) => {
    const { token } = useToken();

    const [item, setItem] = useState({});

    const [expand, setExpand] = useState(false);

    useEffect(() => {
        setItem(props.item);
        setExpand(props.item.VersionToken === props.versionToken);
    }, [props.item, props.versionToken]);

    function generateUpdateInfo(content) {
        const info = String(content).split('<br/>');
        var htmlContent = '';
        info.forEach((a) => {
            if (a.trim().length !== 0) htmlContent += `<div>${a}</div>`;
        });
        return htmlContent;
    }

    const expandItem = (e) => {
        setExpand(!expand);
    };

    return (
        <div className="update-item">
            <Space>
                <div id="show-control" onClick={expandItem}>
                    {!expand ? <DownOutlined /> : <UpOutlined />}
                </div>
                <div className="update-title" onClick={expandItem}>
                    {item.Title}
                </div>
                <span className="update-version">{item.Version}</span>
                {item.VersionToken === props.versionToken ? (
                    <span className="curVersion">当前版本</span>
                ) : (
                    <></>
                )}
            </Space>

            <div className={expand ? 'expand flex-row' : 'update-hide flex-row'}>
                <div
                    className="update-line"
                    style={{ boxShadow: token.boxShadow, backgroundColor: token.colorPrimary }}
                ></div>
                <div className="flex-fill update-detail">
                    <div>更新时间: {item.Date}</div>
                    <div>更新人：{item.Author}</div>
                    <div>更新内容：</div>
                    <div
                        className="update-info"
                        dangerouslySetInnerHTML={{
                            __html: generateUpdateInfo(item.Content),
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
export default UpdateItem;
