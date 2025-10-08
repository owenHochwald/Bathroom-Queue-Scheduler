import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, UserPlus, LogOut } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useContext, useState } from "react"
import { NameContext, NameContextType } from "@/context/usernameContext"
import { joinQueue, leaveQueue } from "@/services/api"
import { Toaster, toast } from 'sonner'

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})


export function JoinQueuePage() {
    const { data, updateName } = useContext<NameContextType>(NameContext);
    const [isEmergency, setIsEmergency] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
        },
    });


    function onSubmit(name: z.infer<typeof FormSchema>) {
        updateName(name.username)
        toast.success("Hello, " + name.username);
    }

    async function handleJoinQueue(username: string, emergency: boolean) {
        await joinQueue(username, emergency)
            .then((res) => {
                return toast.success("Successfully joined the queue!");
            }).catch((err) => {
                return toast.error("Error joining the queue. Please try again.");
            });
    }

    async function handleLeaveQueue(username: string) {
        await leaveQueue(username)
            .then((res) => {
                return toast.success("Successfully leaved the queue!");
            }).catch((err) => {
                return toast.error("Error leaving the queue. Please try again.");
            });
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Join Queue</h1>
                <p className="text-muted-foreground">Enter the bathroom queue or leave if you're already in line</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create Username</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your username..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public queue display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Join Queue Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Join the Queue
                        </CardTitle>
                        <CardDescription>Enter your information to join the bathroom queue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="emergency" onClick={() => { setIsEmergency(!isEmergency) }} />
                            <div className="space-y-0.5">
                                <Label
                                    htmlFor="emergency"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Emergency Request
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Mark this if you have an urgent need
                                </p>
                            </div>
                        </div>
                        <Toaster />
                        <Button className="w-full" size="lg" onClick={async () => handleJoinQueue(data.name, isEmergency)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Join Queue
                        </Button>
                    </CardContent>
                </Card>

                {/* Leave Queue Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogOut className="h-5 w-5" />
                            Leave the Queue
                        </CardTitle>
                        <CardDescription>Remove yourself from the bathroom queue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Important</p>
                                    <p className="text-xs text-muted-foreground">
                                        Only leave the queue if you no longer need to use the bathroom.
                                        You'll lose your position and need to rejoin at the end.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button variant="destructive" className="w-full" size="lg" onClick={async () => handleLeaveQueue(data.name)}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Leave Queue
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Current Status Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Queue Status</CardTitle>
                    <CardDescription>Information about your position in the queue</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* When not in queue */}
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                            <UserPlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-semibold mb-2">Not in Queue</p>
                        <p className="text-sm text-muted-foreground max-w-md">
                            You are not currently in the bathroom queue. Enter your username above to join.
                        </p>
                    </div>

                    {/* When in queue - Replace the above div with this
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Position in Queue</p>
                <p className="text-3xl font-bold text-primary">3rd</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Estimated Wait</p>
                <p className="text-2xl font-semibold">8 min</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <span className="text-xl font-bold">JD</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">Joined 5 minutes ago</p>
              </div>
            </div>
          </div>
          */}
                </CardContent>
            </Card>
        </div>
    )
}
