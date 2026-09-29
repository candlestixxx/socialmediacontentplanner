import React from "react";
"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type CalendarEvent } from '../App';

interface CalendarProps {
  isDashboard?: boolean;
  viewDate: Date;
  setViewDate: (date: Date) => void;
  calendarView: 'month' | 'week';
  setCalendarView: (view: 'month' | 'week') => void;
  selectedDates: Date[];
  scheduledEvents: CalendarEvent[];
  isCompressed: boolean;
  handleMouseDownOnDate: (date: Date) => void;
  handleMouseEnterOnDate: (date: Date) => void;
}

export const Calendar = ({
  isDashboard = false,
  viewDate,
  setViewDate,
  calendarView,
  setCalendarView,
  selectedDates,
  scheduledEvents,
  isCompressed,
  handleMouseDownOnDate,
  handleMouseEnterOnDate
}: CalendarProps) => {

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const renderCalendarHeader = () => (
    <div className="calendar-header">
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
        <h2 style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)'}}>
          {calendarView === 'month' || isDashboard
            ? viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
            : `Week of ${new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate() - viewDate.getDay()).toLocaleDateString('default', { month: 'short', day: 'numeric' })}`}
        </h2>
        <div style={{display: 'flex', gap: '0.25rem', background: 'var(--bg-surface-alt)', padding: '4px', borderRadius: '8px'}}>
          <button className="btn btn-outline" style={{padding: '0.4rem'}} onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
          <button className="btn btn-outline" style={{padding: '0.4rem'}} onClick={handleNextMonth}><ChevronRight size={16} /></button>
        </div>
      </div>

      {!isDashboard && (
        <div className="view-switcher">
          <button
            className={`view-btn ${calendarView === 'month' ? 'active' : ''}`}
            onClick={() => setCalendarView('month')}
          >
            Month
          </button>
          <button
            className={`view-btn ${calendarView === 'week' ? 'active' : ''}`}
            onClick={() => setCalendarView('week')}
          >
            Week
          </button>
        </div>
      )}
    </div>
  );

  const renderCalendarGrid = () => {
    if (calendarView === 'week' && !isDashboard) {
      const startOfWeek = new Date(viewDate);
      startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());

      return (
        <div className="calendar-grid week-view">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isSelected = !!selectedDates.find(d =>
              d.getDate() === date.getDate() &&
              d.getMonth() === date.getMonth() &&
              d.getFullYear() === date.getFullYear()
            );
            const events = scheduledEvents.filter(e =>
              e.day === date.getDate() &&
              e.month === date.getMonth() &&
              e.year === date.getFullYear()
            );

            return (
              <div key={day} className="calendar-column">
                <div className="calendar-day-head">{day} {date.getDate()}</div>
                <div
                  className={`calendar-day week-day ${isSelected ? 'selected' : ''}`}
                  onMouseDown={() => handleMouseDownOnDate(new Date(date))}
                  onMouseEnter={() => handleMouseEnterOnDate(new Date(date))}
                  onClick={() => {}}
                  style={{ userSelect: 'none' }}
                >
                  <div className="day-events-container">
                    {events.map((e, ei) => (
                      <div key={ei} className={`calendar-event ${e.type}`} title={e.title}>
                        <div className="event-time">{e.time}</div>
                        <div className="event-title">{e.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const firstDay = firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
    const totalDays = daysInMonth(viewDate.getMonth(), viewDate.getFullYear());

    return (
      <div className={`calendar-grid ${isDashboard ? 'dashboard-grid' : ''}`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-head">{day}</div>
        ))}
        {Array.from({ length: 42 }).map((_, i) => {
          const dayNum = i - firstDay + 1;
          const isCurrentMonth = dayNum > 0 && dayNum <= totalDays;
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
          const isSelected = !!selectedDates.find(d =>
            d.getDate() === dayNum &&
            d.getMonth() === viewDate.getMonth() &&
            d.getFullYear() === viewDate.getFullYear()
          );

          const events = scheduledEvents.filter(e => e.day === dayNum && e.month === viewDate.getMonth() && e.year === viewDate.getFullYear());

          return (
            <div
              key={i}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isCompressed ? 'compressed' : ''} ${isSelected ? 'selected' : ''}`}
              onMouseDown={() => isCurrentMonth && handleMouseDownOnDate(date)}
              onMouseEnter={() => isCurrentMonth && handleMouseEnterOnDate(date)}
              onClick={() => {}}
              style={{ userSelect: 'none' }}
            >
              {isCurrentMonth && (
                <>
                  <span className="day-number">{dayNum}</span>
                  <div className="day-events-container">
                    {events.map((e, ei) => (
                      <div key={ei} className={`calendar-event ${e.type}`} title={e.title}>
                        {isDashboard ? '' : e.title}
                      </div>
                    ))}
                  </div>
                  {isDashboard && events.length > 0 && (
                    <span className="event-count-badge">{events.length}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {renderCalendarHeader()}
      {renderCalendarGrid()}
    </>
  );
};