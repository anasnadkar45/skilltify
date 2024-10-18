"use client"

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  title: string
  date: string
  time: string
  description?: string
  color: string
  allDay?: boolean
  location?: string
  course?: string
  repeat?: string
}

interface DayInfo {
  day: number
  date: Date
  isCurrentMonth: boolean
}

type CalendarView = 'month' | 'week' | 'day'

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('00:00')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [taskTitle, setTaskTitle] = useState<string>('')
  const [taskNotes, setTaskNotes] = useState<string>('')
  const [taskColor, setTaskColor] = useState<string>('#FF5733')
  const [taskAllDay, setTaskAllDay] = useState<boolean>(false)
  const [taskLocation, setTaskLocation] = useState<string>('')
  const [taskCourse, setTaskCourse] = useState<string>('')
  const [taskRepeat, setTaskRepeat] = useState<string>('Does Not Repeat')
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Custom Calendar',
      date: '2024-10-10',
      time: '12:00',
      description: 'Create a Documentation for Ree',
      color: '#FF5733',
      allDay: false,
      location: 'Office',
      course: 'Project Management',
      repeat: 'Does Not Repeat'
    }
  ])
  const [calendarView, setCalendarView] = useState<CalendarView>('month')

  const todayDate = new Date();
  // console.log(todayDate)

  useEffect(() => {
    setSelectedDate(currentDate.toISOString().split('T')[0])
  }, [currentDate])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days: DayInfo[] = Array.from({ length: 35 }, (_, i) => {
    const day = i - firstDayOfMonth + 1
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return { day, date, isCurrentMonth: day > 0 && day <= daysInMonth }
  })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handlePrev = () => {
    switch (calendarView) {
      case 'month':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        break
      case 'week':
        setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
        break
      case 'day':
        setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
        break
    }
  }

  const handleNext = () => {
    switch (calendarView) {
      case 'month':
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        break
      case 'week':
        setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
        break
      case 'day':
        setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
        break
    }
  }

  const handleDateTimeClick = (date: Date, time?: string) => {
    setSelectedDate(date.toISOString().split('T')[0])
    setSelectedTime(time || '00:00')
    setSelectedEvent(null)
    resetForm()
    setIsModalOpen(true)
    console.log(date.getDate())
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setTaskTitle(event.title)
    setTaskNotes(event.description || '')
    setTaskColor(event.color)
    setTaskAllDay(event.allDay || false)
    setTaskLocation(event.location || '')
    setTaskCourse(event.course || '')
    setTaskRepeat(event.repeat || 'Does Not Repeat')
    setSelectedDate(event.date)
    setSelectedTime(event.time)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setTaskTitle('')
    setTaskNotes('')
    setTaskColor('#FF5733')
    setTaskAllDay(false)
    setTaskLocation('')
    setTaskCourse('')
    setTaskRepeat('Does Not Repeat')
  }

  const handleAddOrUpdateTask = () => {
    if (taskTitle) {
      const newEvent: Event = {
        id: selectedEvent ? selectedEvent.id : Date.now().toString(),
        title: taskTitle,
        date: selectedDate,
        time: taskAllDay ? 'All Day' : selectedTime,
        description: taskNotes,
        color: taskColor,
        allDay: taskAllDay,
        location: taskLocation,
        course: taskCourse,
        repeat: taskRepeat
      }

      if (selectedEvent) {
        setEvents(events.map(event => event.id === selectedEvent.id ? newEvent : event))
      } else {
        setEvents([...events, newEvent])
      }

      resetForm()
      setIsModalOpen(false)
    }
  }

  // Utility function to compare dates
  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 bg-card">
      {weekDays.map(day => (
        <div key={day} className="text-center bg-background py-2 border">{day}</div>
      ))}
      {days.map(({ day, date, isCurrentMonth }, index) => (
        <div
          key={index}
          className={`min-h-20 border p-1 
          ${isCurrentMonth ? 'text-foreground' : 'text-transparent'}
          ${isSameDate(todayDate, date) ? 'bg-background text-primary' : ''}
          ${isSameDate(currentDate, date) ? 'bg-muted' : ''}`
          }
          onClick={() => isCurrentMonth && handleDateTimeClick(date)}
        >
          <div className="text-right">{day}</div>
          {events.filter(event => isSameDate(new Date(event.date), date)).map((event) => (
            <div
              key={event.id}
              className="text-xs p-1 mt-1 rounded cursor-pointer"
              style={{
                backgroundColor: event.color,
                color: getContrastColor(event.color)
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
            >
              {event.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );


  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <div className="grid grid-cols-8 bg-card">
        <div className="border p-2"></div>
        {weekDays.map(day => (
          <div key={day} className="text-center bg-background py-2 border">{day}</div>
        ))}
        {Array.from({ length: 24 }, (_, hour) => (
          <React.Fragment key={hour}>
            <div className="border p-2 text-right">{`${hour.toString().padStart(2, '0')}:00`}</div>
            {weekDays.map((_, dayIndex) => {
              const currentDay = new Date(weekStart);
              currentDay.setDate(weekStart.getDate() + dayIndex);
              const currentDateTime = new Date(currentDay.setHours(hour, 0, 0, 0));

              const isCurrentDay = currentDay.toDateString() === new Date().toDateString(); // Check if it's today

              return (
                <div
                  key={dayIndex}
                  className={`border p-1 min-h-[40px] ${isCurrentDay ? 'bg-background' : ''}`} // Add background color if it's today
                  onClick={() => handleDateTimeClick(currentDateTime, `${hour.toString().padStart(2, '0')}:00`)}
                >
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.date);
                      return eventDate.toDateString() === currentDay.toDateString() &&
                        parseInt(event.time.split(':')[0]) === hour;
                    })
                    .map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded cursor-pointer"
                        style={{
                          backgroundColor: event.color,
                          color: getContrastColor(event.color),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };


  const renderDayView = () => (
    <div className="grid grid-cols-1 bg-card">
      <div className="text-center bg-background py-2 border">{currentDate.toDateString()}</div>
      {Array.from({ length: 24 }, (_, hour) => {
        const currentDateTime = new Date(currentDate.setHours(hour, 0, 0, 0))

        return (
          <div
            key={hour}
            className="border p-2 min-h-[60px]"
            onClick={() => handleDateTimeClick(currentDateTime, `${hour.toString().padStart(2, '0')}:00`)}
          >
            <div className="text-right">{`${hour.toString().padStart(2, '0')}:00`}</div>
            {events
              .filter(event => {
                const eventDate = new Date(event.date)
                return eventDate.toDateString() === currentDate.toDateString() &&
                  parseInt(event.time.split(':')[0]) === hour
              })
              .map((event) => (
                <div
                  key={event.id}
                  className="text-xs p-1 mt-1 rounded cursor-pointer"
                  style={{
                    backgroundColor: event.color,
                    color: getContrastColor(event.color)
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEventClick(event)
                  }}
                >
                  {event.title}
                </div>
              ))}
          </div>
        )
      })}
    </div>
  )

  const renderCalendar = () => {
    switch (calendarView) {
      case 'month':
        return renderMonthView()
      case 'week':
        return renderWeekView()
      case 'day':
        return renderDayView()
    }
  }

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }


  console.log(currentDate)
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <ChevronLeft className="cursor-pointer" onClick={handlePrev} />
          <ChevronRight className="cursor-pointer" onClick={handleNext} />
          <span className="text-xl">
            {calendarView === 'month'
              ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
              : calendarView === 'week'
                ? `Week of ${currentDate.toLocaleDateString()}`
                : currentDate.toLocaleDateString()}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setCalendarView('month')}>month</Button>
          <Button variant="outline" onClick={() => setCalendarView('week')}>week</Button>
          <Button variant="outline" onClick={() => setCalendarView('day')}>day</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {renderCalendar()}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#121212] text-white">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={taskTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskTitle(e.target.value)}
              placeholder="Title..."
              className="bg-[#27272A] border-none text-white"
            />
            <Textarea
              value={taskNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTaskNotes(e.target.value)}
              placeholder="Notes..."
              className="bg-[#27272A] border-none text-white"
            />
            <Select value={taskCourse} onValueChange={setTaskCourse}>
              <SelectTrigger className="bg-[#27272A] border-none text-white">
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course1">Course 1</SelectItem>
                <SelectItem value="course2">Course 2</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: taskColor }}></div>
              <Input
                type="color"
                value={taskColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskColor(e.target.value)}
                className="w-8  h-8 p-0 border-none"
              />
              <span>Color</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="all-day"
                checked={taskAllDay}
                onCheckedChange={setTaskAllDay}
              />
              <Label htmlFor="all-day">all day</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label>start</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                className="bg-[#27272A] border-none text-white"
              />
              <Input
                type="time"
                value={selectedTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTime(e.target.value)}
                className="bg-[#27272A] border-none text-white"
                disabled={taskAllDay}
              />
            </div>
            <Select value={taskRepeat} onValueChange={setTaskRepeat}>
              <SelectTrigger className="bg-[#27272A] border-none text-white">
                <SelectValue placeholder="Does Not Repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Does Not Repeat">Does Not Repeat</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <MapPin className="text-white" />
              <Input
                value={taskLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskLocation(e.target.value)}
                placeholder="Location"
                className="bg-[#27272A] border-none text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className='hover:bg-transparent hover:text-muted-foreground transition-all duration-300 animate-in' onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOrUpdateTask}>{selectedEvent ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}