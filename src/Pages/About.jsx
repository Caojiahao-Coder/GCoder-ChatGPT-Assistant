import { Col, Row, Tag, theme } from 'antd';
import '../Style/About.css';
import jsonData from '../Static/UpdateLog.json';
import UpdateItem from '../Components/UpdateItem';
import FeatureItem from '../Components/FeatureItem';
const { useToken } = theme;
const About = () => {
    const { token } = useToken();

    const featuresList = [
        {
            content: '基础聊天回答',
            done: true,
        },
        {
            content: '可持续Session会话模式',
            done: true,
        },
        {
            content: '历史聊天记录',
            done: true,
        },
        {
            content: '智能搜索',
            done: true,
        },
        {
            content: '高级搜索生成',
            done: true,
        },
        {
            content: '图像处理能力',
            done: false,
        },
        {
            content: '语音处理能力',
            done: false,
        },
        {
            content: '适配深色模式',
            done: true,
        },
    ];

    return (
        <div style={{ backgroundColor: token.colorBgLayout }}>
            <Row gutter={24}>
                <Col
                    xs={{ span: 24, offset: 0 }}
                    sm={{ span: 24, offset: 0 }}
                    md={{ span: 24, offset: 0 }}
                    lg={{ span: 16, offset: 4 }}
                    xl={{ span: 18, offset: 3 }}
                    xxl={{ span: 18, offset: 3 }}
                >
                    <div
                        id="about-root"
                        style={{
                            backgroundColor: token.colorBgContainer,
                            padding: token.padding,
                            boxShadow: token.boxShadow,
                            borderRadius: token.borderRadius,
                        }}
                    >
                        <div id="about-content" style={{ color: token.colorText }}>
                            <h2>项目信息</h2>
                            <div>一款基于OpenAI，ChatGPT API所开发的个人助手项目。</div>
                            <div>
                                项目仓库：
                                <a href="https://github.com/Caojiahao-Coder/GCoder-ChatGPT-Assistant">
                                    https://github.com/Caojiahao-Coder/GCoder-ChatGPT-Assistant
                                </a>
                            </div>
                            <div>
                                模型：
                                <Tag color="blue-inverse">gpt-3.5-turbo</Tag>
                            </div>
                            <h2>Features</h2>
                            <ul>
                                {featuresList.map((item, index) => (
                                    <li key={index}>
                                        <FeatureItem done={item.done} content={item.content} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h1 style={{ marginTop: 24, color: token.colorText }}>Update log</h1>
                        <div style={{ color: token.colorText }}>
                            {jsonData.LogList.map((item, index) => (
                                <UpdateItem
                                    item={item}
                                    versionToken={jsonData.VersionToken}
                                    key={index}
                                />
                            ))}
                        </div>

                        <button
                            id="btn-back"
                            onClick={() => {
                                window.location.href = '/';
                            }}
                        >
                            Back
                        </button>
                    </div>
                </Col>
            </Row>

            <div className="footer">Copyright © 2023 Jiahao Cao. All rights reserved.</div>
        </div>
    );
};
export default About;
