import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueueDisplay } from './components/QueueDisplay';

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <QueueDisplay />
            </div>
        </QueryClientProvider>

    );
}

export default App;
