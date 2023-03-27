import { ConfigProvider, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import About from './Pages/About';
import App from './Pages/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<App />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    </>
);
