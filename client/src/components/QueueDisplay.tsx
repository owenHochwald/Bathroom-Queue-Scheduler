import { useQuery } from "@tanstack/react-query"
import { FC, useEffect } from "react"
import { getQueueStatus } from "../services/api"
import { QueueStatus } from "../types/types"

export const QueueDisplay: FC = () => {
    const { data, isLoading, error } = useQuery<QueueStatus>({
        queryFn: async () => {
            try {
                const response = await getQueueStatus();
                // Debug log to see exact response structure
                console.log('Raw Response:', {
                    status: response.status,
                    headers: response.headers,
                    data: response.data
                });
                return response.data;
            } catch (err) {
                console.error('Query Error:', err);
                throw err;
            }
        },
        queryKey: ['queueStatus'],
        retry: false,
    });

    // Add debugging for component state
    useEffect(() => {
        console.log('Current State:', {
            isLoading,
            error: error ? (error as Error).message : null,
            data
        });
    }, [data, isLoading, error]);

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {(error as Error).message}</div>
    if (!data) return <div>No data available</div>

    return (
    <div>
        <h1>Queue Status</h1>
        <div>
            <p>Current User: {data.current_user}</p>
            <p>Occupied: {data.is_occupied ? 'Yes' : 'No'}</p>
            <p>Queue Length: {data.queue.length}</p>
            
            {data.queue.length > 0 && (
                <div>
                    <h2>Queue:</h2>
                    {data.queue.map((item, index) => (
                        <div key={item.user_id}>
                            <p>
                                Position {item.position}: {item.user_id}
                                {item.is_emergency && ' (Emergency)'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
);
}