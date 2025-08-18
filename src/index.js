import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {BrowserRouter} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()
root.render(
    <BrowserRouter>
     <QueryClientProvider client={queryClient}>
        {/* <React.StrictMode> */}
            <App/>
        {/* </React.StrictMode> */}
     </QueryClientProvider>
    </BrowserRouter>
);
