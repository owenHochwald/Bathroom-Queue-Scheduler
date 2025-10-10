import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { History, TrendingUp, Clock, Users } from "lucide-react"
import { toast } from "sonner"
import { getHistory } from "@/services/api"
import { HistoryItem } from "@/types/types"
import { useEffect, useState } from "react"

interface TableEntry {
    user: string;
    duration: number;
    joined: Date;
}

export function HistoryPage() {
    const [tableItems, setTableItems] = useState<TableEntry[]>([]);

    async function handleHistory(): Promise<TableEntry[]> {
        try {
            const res = await getHistory();
            console.log(res.data);
            return getTableEntries(res.data);
        } catch {
            toast.error("Failed to fetch history");
            return [];
        }
    }

    function timeAgo(date: Date): string {
        const diff = Date.now() - date.getTime(); // ms
        const minutes = Math.floor(diff / 1000 / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }


    const getTableEntries = (history: HistoryItem[]): TableEntry[] => {
        console.log("Input history:", history);

        return history.map(item => {
            console.log("Processing item:", item);
            console.log("userId:", item.user_id);
            console.log("queue:", item.timestamp);
            const entry: TableEntry = {
                user: item.user_id,
                duration: item.duration,
                joined: new Date(item.timestamp * 1000)
            };

            console.log("Created entry:", entry);
            return entry;
        });
    }

    useEffect(() => {
        handleHistory().then(items => {
            console.log(items)
            setTableItems(items)
        });
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Queue History</h1>
                <p className="text-muted-foreground">Historical data and analytics for the bathroom queue</p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Uses Today</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                tableItems.filter(item => {
                                    return Date.now() - item.joined.getTime() <= 24 * 60 * 60 * 1000;
                                }).length
                            }
                        </div>
                        {/* <p className="text-xs text-muted-foreground mt-2">+12% from yesterday</p> */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                Math.round(tableItems.reduce(
                                    (sum, item) => sum + item.duration,
                                    0
                                ) / tableItems.length)
                            } mins
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Average time</p>
                    </CardContent>
                </Card>
            </div>

            {/* History Tables */}
            <Tabs defaultValue="recent" className="flex-1">


                <TabsContent value="recent" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent History</CardTitle>
                            <CardDescription>Last 100 bathroom uses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Join Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableItems && tableItems.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.user}</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                            <TableCell>{timeAgo(item.joined)}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
