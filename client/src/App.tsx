import { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { QueueStatusPage } from '@/pages/QueueStatusPage';
import { JoinQueuePage } from '@/pages/JoinQueuePage';
import { HistoryPage } from '@/pages/HistoryPage';
import NameContext from './context/usernameContext';

const queryClient = new QueryClient()

function App() {
    const [activePage, setActivePage] = useState<string>('status');

    const renderPage = () => {
        switch (activePage) {
            case 'status':
                return <QueueStatusPage />;
            case 'join':
                return <JoinQueuePage />;
            case 'history':
                return <HistoryPage />;
            default:
                return <QueueStatusPage />;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <NameContext value="Random User" >
                <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                        <AppSidebar activePage={activePage} onNavigate={setActivePage} />
                        <main className="flex flex-1 flex-col">
                            <div className="flex items-center gap-4 border-b border-border p-4 lg:hidden">
                                <SidebarTrigger />
                                <h1 className="text-lg font-semibold">Bathroom Queue</h1>
                            </div>
                            {renderPage()}
                        </main>
                    </div>
                </SidebarProvider>
            </NameContext>

        </QueryClientProvider>
    );
}

export default App;
