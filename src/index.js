import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="486178431730-n3j2ss0eajd1apjjlci9chaidjv7v925.apps.googleusercontent.com">
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </Router>
        </React.StrictMode>
    </GoogleOAuthProvider>
);