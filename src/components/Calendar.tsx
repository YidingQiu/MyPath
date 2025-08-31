import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CalendarEvent {
  date: number;
  type: 'tax' | 'premises' | 'urgent';
  title: string;
}

interface CalendarProps {
  view: 'monthly' | 'weekly' | 'yearly';
  events?: CalendarEvent[];
}

export function Calendar({ view, events = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getEventsForDate = (date: number) => {
    return events.filter(event => event.date === date);
  };

  const getEventDotColor = (type: string) => {
    switch (type) {
      case 'tax': return 'bg-blue-500';
      case 'premises': return 'bg-green-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const exportToCalendar = () => {
    let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MyPath//SME Support//EN
CALNAME:Business Compliance Calendar
X-WR-CALNAME:Business Compliance Calendar
DESCRIPTION:Compliance deadlines for your catering business
X-WR-CALDESC:Compliance deadlines for your catering business
TIMEZONE-ID:Australia/Melbourne
X-WR-TIMEZONE:Australia/Melbourne
`;

    events.forEach((event, index) => {
      const eventDate = new Date(currentYear, currentMonth, event.date);
      const dateString = eventDate.toISOString().split('T')[0].replace(/-/g, '');
      
      icalContent += `BEGIN:VEVENT
UID:sme-compliance-${index}@mypath.gov.au
DTSTART:${dateString}
SUMMARY:${event.title}
DESCRIPTION:Business compliance requirement for Cathy Cook's Catering Business
CATEGORIES:BUSINESS,COMPLIANCE,TAX
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
`;
    });

    icalContent += 'END:VCALENDAR';

    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-compliance-calendar.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (view === 'monthly') {
    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="h-20 p-1 border-r border-b border-gray-200"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
      
      calendarDays.push(
        <div key={day} className="h-20 p-1 border-r border-b border-gray-200 relative">
          <div className={`text-sm font-medium ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
            {day}
          </div>
          {dayEvents.length > 0 && (
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getEventDotColor(event.type)}`}></div>
                  <span className="text-xs text-gray-600 truncate">{event.title}</span>
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={exportToCalendar} size="sm" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Export to Calendar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-t border-l border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 bg-gray-50 border-r border-b border-gray-200 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-l border-gray-200">
            {calendarDays}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Placeholder for other views
  return (
    <Card>
      <CardHeader>
        <CardTitle>{view.charAt(0).toUpperCase() + view.slice(1)} View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 text-gray-500">
          {view.charAt(0).toUpperCase() + view.slice(1)} view coming soon...
        </div>
      </CardContent>
    </Card>
  );
}