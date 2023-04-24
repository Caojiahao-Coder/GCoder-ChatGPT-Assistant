import { ConfigProvider, FloatButton } from 'antd';
import Dark from './Theme/Dark.jsx';
import Light from './Theme/Light.jsx';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BulbOutlined, SkinOutlined } from '@ant-design/icons';
import './index.css';
import About from './Pages/About';
import Home from './Pages/Home';

const App = () => {
    const [isDark, setIsDark] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : false
    );

    return (
        <ConfigProvider theme={{ token: isDark ? Dark : Light }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>

            <FloatButton.Group>
                <FloatButton
                    type="primary"
                    icon={<BulbOutlined />}
                    tooltip="关于站点"
                    onClick={() => (window.location.href = '/about')}
                />
                <FloatButton
                    type={isDark ? 'primary' : 'default'}
                    icon={<SkinOutlined />}
                    tooltip="深色模式"
                    onClick={() => {
                        localStorage.setItem('theme', isDark ? 'light' : 'dark');
                        setIsDark(!isDark);
                    }}
                />
            </FloatButton.Group>
        </ConfigProvider>
    );
};

export default App;
