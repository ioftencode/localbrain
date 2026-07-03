'use client';

import { useState } from 'react';
import DailyLog from '@/components/DailyLog/DailyLog';
import CalendarView from '@/components/CalendarView/CalendarView';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/database/db';
import VaultApp from '@/vault/components/VaultApp';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Check for existing data to show welcome message
  const hasData = useLiveQuery(async () => {
    const count = await db.daily_logs.count();
    return count > 0;
  }, []);

  return (
    <>
      <VaultApp />
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">Daily Log</h1>
            <button
              onClick={() => setShowCalendar(true)}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              📅 Calendar
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            <kbd className="px-2 py-1 bg-gray-800 rounded">Alt</kbd>
            <span className="mx-1">+</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded">X</kbd>
            <span className="ml-2">New Task</span>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <DailyLog
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </main>

      {/* Welcome Modal for first-time users */}
      {!hasData && showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Daily Log! 📝</h2>
            <p className="text-gray-300 mb-6">
              Your local, offline-first productivity companion. Everything is stored in your browser—no accounts, no sync, just your data.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                  1
                </div>
                <p className="text-gray-300">Click <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">+ Add Task</kbd> or press <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">Alt+X</kbd></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                  2
                </div>
                <p className="text-gray-300">Type your daily thoughts in the note area</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                  3
                </div>
                <p className="text-gray-300">Use the calendar to navigate between days</p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {showCalendar && (
        <CalendarView
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </>
  );
}
