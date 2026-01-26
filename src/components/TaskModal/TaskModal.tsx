'use client';

import { useState } from 'react';
import { type Category } from '@/lib/database/db';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    task: string;
    category: string;
    time_expected?: string;
  }) => void;
  categories: Category[];
}

export default function TaskModal({ isOpen, onClose, onSubmit, categories }: TaskModalProps) {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Work');
  const [timeExpected, setTimeExpected] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim()) {
      alert('Please enter a task');
      return;
    }

    onSubmit({
      task: task.trim(),
      category,
      time_expected: timeExpected || undefined
    });

    // Reset form
    setTask('');
    setCategory(categories[0]?.name || 'Work');
    setTimeExpected('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Add New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expected Time (optional)</label>
            <input
              type="text"
              value={timeExpected}
              onChange={(e) => setTimeExpected(e.target.value)}
              placeholder="e.g., 30 minutes, 1 hour"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
