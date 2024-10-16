'use client'

import { useState } from "react"
import { Bell, Book, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, FileText, Home, Layout, MessageSquare, Settings, Users, Zap, Map, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"

export function SkilltifyDarkUiCalendar() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAITutorOpen, setIsAITutorOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex h-screen bg-background text-foreground dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4 flex flex-col bg-card">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-primary rounded-full mr-2"></div>
          <span className="text-2xl font-bold">Skilltify</span>
        </div>
        <nav className="space-y-2 flex-grow">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Book className="mr-2 h-4 w-4" />
            Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Layout className="mr-2 h-4 w-4" />
            Tasks
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Flashcards
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Collaboration
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsAITutorOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            AI Tutor
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Map className="mr-2 h-4 w-4" />
            Study Roadmap
          </Button>
        </nav>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        {/* Header */}
        <header className="border-b border-border p-4 flex justify-between items-center bg-card">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="roadmap">Study Roadmap</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6</div>
                    <p className="text-xs text-muted-foreground">2 in progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
                    <Layout className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 due today</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24h</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Flashcards Reviewed</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">250</div>
                    <p className="text-xs text-muted-foreground">85% retention rate</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">{/* Add chart component here */}</div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>AI-Generated Tasks</CardTitle>
                    <CardDescription>Based on your upcoming deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox id="task1" className="mr-2" />
                        <label htmlFor="task1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Review Chapter 5 for Biology
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="task2" className="mr-2" />
                        <label htmlFor="task2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Complete Math Problem Set
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="task3" className="mr-2" />
                        <label htmlFor="task3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Prepare outline for History essay
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="roadmap" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Study Roadmap</CardTitle>
                  <CardDescription>AI-generated study plan based on your courses and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">This Week's Focus</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Biology: Cellular Respiration</span>
                            <Badge>High Priority</Badge>
                          </div>
                          <Progress value={60} className="w-full" />
                          <p className="text-sm text-muted-foreground">3 hours left to complete target study time</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Upcoming Milestones</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>Math Midterm Exam (in 2 weeks)</span>
                          </li>
                          <li className="flex items-center">
                            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>History Research Paper (in 3 weeks)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Long-term Goals</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="w-24">End of Semester:</span>
                            <Progress value={40} className="w-full ml-2" />
                          </li>
                          <li className="flex items-center">
                            <span className="w-24">SAT Prep:</span>
                            <Progress value={25} className="w-full ml-2" />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Study Calendar</h3>
                      <Card>
                        <CardContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow"
                          />
                        </CardContent>
                      </Card>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Today's Tasks</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Checkbox id="task4" className="mr-2" />
                            <label htmlFor="task4" className="text-sm">Biology: Read Chapter 7</label>
                          </li>
                          <li className="flex items-center">
                            <Checkbox id="task5" className="mr-2" />
                            <label htmlFor="task5" className="text-sm">Math: Practice Set 3</label>
                          </li>
                          <li className="flex items-center">
                            <Checkbox id="task6" className="mr-2" />
                            <label htmlFor="task6" className="text-sm">History: Research for essay</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* AI Tutor Chat (Collapsible) */}
      {isAITutorOpen && (
        <aside className="w-80 border-l border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI Tutor</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsAITutorOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-grow overflow-auto p-4 space-y-4">
            <div className="bg-muted p-2 rounded-lg">
              <p className="text-sm">How can I help you today?</p>
            </div>
            <div className="bg-primary text-primary-foreground p-2 rounded-lg ml-auto max-w-[80%]">
              <p className="text-sm">Can you explain the Krebs cycle?</p>
            </div>
            <div className="bg-muted p-2 rounded-lg">
              <p className="text-sm">The Krebs cycle, also known as the citric acid cycle, is a series of chemical reactions used by all aerobic organisms to release stored energy. Here's a brief  overview:</p>
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <Input placeholder="Ask a question..." className="flex-grow mr-2" />
              <Button size="icon">
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

function Checkbox(props) {
  return (
    <div className="flex items-center space-x-2">
      <input type="checkbox" {...props} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
    </div>
  )
}