import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Users } from "lucide-react"

export function QueueStatusPage() {
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
            <Badge variant="destructive" className="mt-2">In Use</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Length</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-2">People waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Wait</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 min</div>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-xl font-bold">JD</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold">John Doe</p>
              <p className="text-sm text-muted-foreground">In bathroom for 4 minutes</p>
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
            {/* Queue Item 1 */}
            <div className="flex items-center gap-4 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-muted-foreground">Joined 2 minutes ago</p>
              </div>
              <Badge variant="secondary">Normal</Badge>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center gap-4 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold">Mike Johnson</p>
                <p className="text-sm text-muted-foreground">Joined 1 minute ago</p>
              </div>
              <Badge variant="secondary">Normal</Badge>
            </div>

            {/* Queue Item 3 - Emergency */}
            <div className="flex items-center gap-4 rounded-lg border border-destructive bg-destructive/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground font-bold">
                3
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold">Sarah Williams</p>
                <p className="text-sm text-muted-foreground">Joined 30 seconds ago</p>
              </div>
              <Badge variant="destructive">Emergency</Badge>
            </div>
          </div>

          {/* Empty State - Hidden when there are items */}
          {/* Uncomment to show when queue is empty
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Queue is Empty</p>
            <p className="text-sm text-muted-foreground">No one is waiting right now</p>
          </div>
          */}
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
