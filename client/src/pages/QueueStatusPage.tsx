import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Users } from "lucide-react"
import { QueueStatus } from "@/types/types"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { getQueueStatus } from "@/services/api"

export function QueueStatusPage() {
    const [queueStatus, setQueueStatus] = useState<QueueStatus>()

    async function handleQueueStatus(): Promise<QueueStatus> {
        try {
            const res = await getQueueStatus();
            return res.data;
        } catch {
            toast.error("Failed to fetch queue status");
            return {
                current_user: "",
                queue: [],
                is_occupied: false
            }
        }
    }

    useEffect(() => {
        handleQueueStatus().then(status => {
            console.log(status);
            setQueueStatus(status);

        })
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Queue Status</h1>
                <p className="text-muted-foreground">Live bathroom queue status and monitoring</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Occupied</div>
                        {queueStatus && queueStatus.is_occupied ? (
                            <Badge variant="destructive" className="mt-2">In Use</Badge>
                        ) : (
                            <Badge variant="default" className="mt-2">Free</Badge>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Queue Length</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueStatus?.queue.length}</div>
                        <p className="text-xs text-muted-foreground mt-2">People waiting</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estimated Wait</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{queueStatus ? queueStatus?.queue.length * 10 : 0}</div>
                        <p className="text-xs text-muted-foreground mt-2">Approximate time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Current User Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Current User</CardTitle>
                    <CardDescription>Person currently using the bathroom</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {queueStatus?.current_user.length ?
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <span className="text-xl font-bold">{queueStatus?.current_user.length ? queueStatus?.current_user[0] : "G"}</span>
                            </div> :
                            null
                        }
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold">{queueStatus?.current_user}</p>
                            {/* <p className="text-sm text-muted-foreground">In bathroom for 4 minutes</p> */}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Queue List */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Queue</CardTitle>
                    <CardDescription>People waiting in line</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {queueStatus &&
                            queueStatus.queue.map((item, index) => (
                                <div
                                    className={`flex items-center gap-4 rounded-lg border p-4 ${item.is_emergency ? 'border-destructive bg-destructive/10' : 'border-border'
                                        }`}
                                    key={index}
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${item.is_emergency
                                            ? 'bg-destructive text-destructive-foreground'
                                            : 'bg-primary text-primary-foreground'
                                            }`}
                                    >
                                        {item.position}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <p className="font-semibold">{item.user_id}</p>
                                        <p className="text-sm text-muted-foreground">Joined at {item.joined_at}</p>
                                    </div>
                                    {item.is_emergency ? (
                                        <Badge variant="destructive">Emergency</Badge>
                                    ) : (
                                        <Badge variant="secondary">Normal</Badge>
                                    )}
                                </div>
                            ))
                        }
                    </div>

                    {!queueStatus || queueStatus.queue.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold">Queue is Empty</p>
                            <p className="text-sm text-muted-foreground">No one is waiting right now</p>
                        </div>
                    ) : null}

                </CardContent>
            </Card>

            {/* Live Update Indicator */}
            <Card className="border-primary/50">
                <CardContent className="flex items-center gap-3 py-4">
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    <p className="text-sm font-medium">Connected to live updates via WebSocket</p>
                </CardContent>
            </Card>
        </div>
    )
}
