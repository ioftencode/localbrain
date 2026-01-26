'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/database/db';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export default function CalendarView({ selectedDate, onDateSelect, onClose }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get all logs for the current month
  const monthLogs = useLiveQuery(async () => {
    const startKey = format(monthStart, 'yyyy-MM-dd');
    const endKey = format(monthEnd, 'yyyy-MM-dd');
    
    return await db.daily_logs
      .where('date')
      .between(startKey, endKey, true, true)
      .toArray();
  }, [monthStart, monthEnd]);

  const getDateStatus = (date: Date) => {
    if (!monthLogs) return null;
    
    const dateKey = format(date, 'yyyy-MM-dd');
    const log = monthLogs.find(l => l.date === dateKey);
    
    if (!log || log.todos.length === 0) return 'empty';
    
    const completedCount = log.todos.filter(t => t.is_completed).length;
    const totalCount = log.todos.length;
    
    if (completedCount === totalCount) return 'completed';
    if (completedCount > 0) return 'partial';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const prevMonth = new Date(currentMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setCurrentMonth(prevMonth);
              }}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const nextMonth = new Date(currentMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentMonth(nextMonth);
              }}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold py-2 text-gray-300">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const status = getDateStatus(day);
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isTodayDate = isToday(day);
            
            return (
              <button
                key={day.toString()}
                onClick={() => {
                  onDateSelect(day);
                  onClose();
                }}
                className={`
                  h-12 rounded-lg flex flex-col items-center justify-center relative transition-colors
                  ${isSelected ? 'bg-blue-600' : 'hover:bg-gray-700'}
                  ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                `}
              >
                <span className={isTodayDate ? 'font-bold' : ''}>
                  {format(day, 'd')}
                </span>
                
                {status === 'pending' && (
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />
                )}
                {status === 'completed' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1" />
                )}
                {status === 'partial' && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Pending tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>All completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Some completed</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Close Calendar
        </button>
      </div>
    </div>
  );
}
