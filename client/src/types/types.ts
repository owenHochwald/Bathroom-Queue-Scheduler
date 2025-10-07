export interface HistoryItem {
    userId: string;
    duration: number;
    queue: QueuePosition[];
}

export interface QueuePosition {
    userId: string;
    position: number;
    isEmergency: boolean;
    joinedAt: Date;

}

export interface QueueStatus {
	is_occupied: boolean;
	current_user: string;
	queue: QueuePosition[];
}