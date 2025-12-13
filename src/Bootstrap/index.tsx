import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const ROOT_ELEMENT = document.getElementById('root');

if (ROOT_ELEMENT) {
    const root = ReactDOM.createRoot(ROOT_ELEMENT);

    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
