import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, TrendingUp, Clock, Users } from "lucide-react"

export function HistoryPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Queue History</h1>
        <p className="text-muted-foreground">Historical data and analytics for the bathroom queue</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-2">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5 min</div>
            <p className="text-xs text-muted-foreground mt-2">Average time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:30 PM</div>
            <p className="text-xs text-muted-foreground mt-2">Most busy hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Uses</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-2">Today's emergencies</p>
          </CardContent>
        </Card>
      </div>

      {/* History Tables */}
      <Tabs defaultValue="recent" className="flex-1">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
              <CardDescription>Last 10 bathroom uses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Queue Size</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>4:23</TableCell>
                    <TableCell>2:15</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Normal</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">5 min ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>3:45</TableCell>
                    <TableCell>0:00</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Normal</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">15 min ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mike Johnson</TableCell>
                    <TableCell>6:12</TableCell>
                    <TableCell>4:30</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Emergency</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">32 min ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Williams</TableCell>
                    <TableCell>5:01</TableCell>
                    <TableCell>1:45</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Normal</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">48 min ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Alex Brown</TableCell>
                    <TableCell>3:30</TableCell>
                    <TableCell>0:30</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Normal</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">1 hour ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's History</CardTitle>
              <CardDescription>All bathroom uses from today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-center">
                <div className="space-y-3">
                  <History className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-lg font-semibold">Data will populate here</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    This section will show all bathroom uses from today once you implement the data fetching logic
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>This Week's History</CardTitle>
              <CardDescription>Bathroom usage summary for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-center">
                <div className="space-y-3">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-lg font-semibold">Weekly Analytics</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    This section will show weekly trends and patterns once you implement the analytics logic
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
