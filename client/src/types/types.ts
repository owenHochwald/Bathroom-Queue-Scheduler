export interface HistoryItem {
    userId: string;
    duration: number;
    queue: QueuePosition[];
}

export interface QueuePosition {
    user_id: string;
    position: number;
    is_emergency: boolean;
    joined_at: number;
}

export interface QueueStatus {
    is_occupied: boolean;
    current_user: string;
    queue: QueuePosition[];
}

export interface UserStatus {
    user_id: string;
    position: number;
    wait_time: number;
}