import { notification } from 'antd';
import { useEffect } from 'react';
import jsonData from '../Static/UpdateLog.json';
/**
 * 更新提示组件
 * @returns
 */
const UpdatePrompt = () => {
    useEffect(() => {
        const rawData = jsonData;
        const versionToken = rawData.VersionToken;
        const item = rawData.LogList.filter((a) => a.VersionToken === versionToken)[0];

        const curPageVersion = localStorage.getItem('curPageVersion');

        //如果当前的版本为空 或者当前Page的版本不等于最新发布的版本
        if (!curPageVersion || curPageVersion !== versionToken) {
            showUpdateLog(item);
        }
        localStorage.setItem('curPageVersion', versionToken);
    }, []);

    /**
     * 显示更新日志
     * @param {更新日志内容} logItem
     */
    function showUpdateLog(logItem) {
        notification.open({
            message: (
                <div
                    style={{
                        fontFamily: 'BoldFont',
                        fontWeight: 'bold',
                        fontSize: 18,
                    }}
                >
                    {logItem.Title}
                </div>
            ),
            description: (
                <>
                    <div>当前版本：{logItem.Version}</div>
                    <div>更新时间：{logItem.Date}</div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: '<br/><strong>更新内容:</strong><br/>' + logItem.Content,
                        }}
                    ></div>
                </>
            ),
        });
    }

    return <></>;
};
export default UpdatePrompt;
