'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Todo, type Category } from '@/lib/database/db';
import { v4 as uuidv4 } from 'uuid';
import TaskModal from '../TaskModal/TaskModal';
import CategorySection from './CategorySection';

interface DailyLogProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DailyLog({ selectedDate, onDateChange }: DailyLogProps) {
  const [generalNote, setGeneralNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [optimisticCategories, setOptimisticCategories] = useState<string[]>([]);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  
  const dailyLog = useLiveQuery(
    () => db.daily_logs.get(dateKey),
    [dateKey]
  );

  const categories = useLiveQuery(
    () => db.categories.toArray().then(cats => cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))),
    []
  );

  useEffect(() => {
    if (dailyLog) {
      setGeneralNote(dailyLog.general_note || '');
    } else {
      setGeneralNote('');
    }
  }, [dailyLog]);

  const saveGeneralNote = useCallback(async (note: string) => {
    await db.daily_logs.put({
      date: dateKey,
      general_note: note,
      todos: dailyLog?.todos || []
    });
  }, [dateKey, dailyLog?.todos]);

  const handleNoteChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setGeneralNote(value);
    await saveGeneralNote(value);
  };

  const handleAddTask = async (taskData: {
    task: string;
    category: string;
    time_expected?: string;
  }) => {
    const currentLog = await db.daily_logs.get(dateKey);
    const todos = currentLog?.todos || [];
    
    const newTask: Todo = {
      id: uuidv4(),
      date: dateKey,
      ...taskData,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: todos.length
    };

    await db.daily_logs.put({
      date: dateKey,
      general_note: currentLog?.general_note || '',
      todos: [...todos, newTask]
    });

    setIsModalOpen(false);
  };

  const handleToggleComplete = async (taskId: string) => {
    const currentLog = await db.daily_logs.get(dateKey);
    if (!currentLog) return;

    const updatedTodos = currentLog.todos.map(todo =>
      todo.id === taskId
        ? { ...todo, is_completed: !todo.is_completed, updated_at: new Date().toISOString() }
        : todo
    );

    await db.daily_logs.put({
      ...currentLog,
      todos: updatedTodos
    });
  };

  const handleMoveToTomorrow = async (taskId: string) => {
    const currentLog = await db.daily_logs.get(dateKey);
    if (!currentLog) return;

    const task = currentLog.todos.find(t => t.id === taskId);
    if (!task) return;

    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = format(tomorrow, 'yyyy-MM-dd');

    // Remove from today
    const updatedTodos = currentLog.todos.filter(t => t.id !== taskId);
    await db.daily_logs.put({
      ...currentLog,
      todos: updatedTodos
    });

    // Add to tomorrow
    const tomorrowLog = await db.daily_logs.get(tomorrowKey);
    const tomorrowTodos = tomorrowLog?.todos || [];
    
    await db.daily_logs.put({
      date: tomorrowKey,
      general_note: tomorrowLog?.general_note || '',
      todos: [...tomorrowTodos, { ...task, date: tomorrowKey }]
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    const currentLog = await db.daily_logs.get(dateKey);
    if (!currentLog) return;

    const updatedTodos = currentLog.todos.filter(t => t.id !== taskId);
    await db.daily_logs.put({
      ...currentLog,
      todos: updatedTodos
    });
  };

  const handleReorderTodos = useCallback(async (categoryName: string, reorderedTodos: Todo[]) => {
    const currentLog = await db.daily_logs.get(dateKey);
    if (!currentLog) return;

    // Update todos with new order
    const updatedTodos = currentLog.todos.map(todo => {
      const reorderedTodo = reorderedTodos.find(rt => rt.id === todo.id);
      return reorderedTodo ? { ...reorderedTodo, updated_at: new Date().toISOString() } : todo;
    });

    await db.daily_logs.put({
      ...currentLog,
      todos: updatedTodos
    });
  }, [dateKey]);

  const handleReorderCategories = useCallback(async (reorderedCategories: Category[]) => {
    // Optimistic update
    setOptimisticCategories(reorderedCategories.map(c => c.name));
    
    // Update all categories with new order
    for (let i = 0; i < reorderedCategories.length; i++) {
      await db.categories.update(reorderedCategories[i].name, { order: i });
    }
  }, []);

  const todosByCategory = (dailyLog?.todos || []).reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  const orderedCategoryNames = optimisticCategories.length > 0 
    ? optimisticCategories.filter(name => todosByCategory[name])
    : categories
        ? categories
            .filter(cat => todosByCategory[cat.name])
            .map(cat => cat.name)
            .sort((a, b) => {
              const catA = categories.find(c => c.name === a);
              const catB = categories.find(c => c.name === b);
              return (catA?.order ?? 0) - (catB?.order ?? 0);
            })
        : Object.keys(todosByCategory);

  const handleDragStartCategory = useCallback((e: React.DragEvent, categoryName: string) => {
    setDraggedCategory(categoryName);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOverCategory = useCallback((e: React.DragEvent, categoryName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedCategory && categoryName !== draggedCategory) {
      const draggedIndex = orderedCategoryNames.indexOf(draggedCategory);
      const overIndex = orderedCategoryNames.indexOf(categoryName);
      
      if (draggedIndex !== -1 && overIndex !== -1 && draggedIndex !== overIndex) {
        // Optimistic update for smooth visual feedback
        const newNames = [...orderedCategoryNames];
        const [draggedName] = newNames.splice(draggedIndex, 1);
        newNames.splice(overIndex, 0, draggedName);
        setOptimisticCategories(newNames);
      }
    }
    
    setDragOverCategory(categoryName);
  }, [draggedCategory, orderedCategoryNames]);

  const handleDragLeaveCategory = useCallback(() => {
    setDragOverCategory(null);
  }, []);

  const handleDropCategory = useCallback((e: React.DragEvent, dropCategoryName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedCategory || draggedCategory === dropCategoryName) {
      setDraggedCategory(null);
      setDragOverCategory(null);
      return;
    }

    const draggedIndex = orderedCategoryNames.indexOf(draggedCategory);
    const dropIndex = orderedCategoryNames.indexOf(dropCategoryName);

    if (draggedIndex === -1 || dropIndex === -1) {
      setDraggedCategory(null);
      setDragOverCategory(null);
      return;
    }

    const reorderedNames = [...orderedCategoryNames];
    const [draggedName] = reorderedNames.splice(draggedIndex, 1);
    reorderedNames.splice(dropIndex, 0, draggedName);

    // Create reordered categories
    const reorderedCategories = reorderedNames
      .map(name => categories?.find(c => c.name === name))
      .filter((cat): cat is Category => cat !== undefined);

    handleReorderCategories(reorderedCategories);
    setDraggedCategory(null);
    setDragOverCategory(null);
  }, [draggedCategory, orderedCategoryNames, categories, handleReorderCategories]);

  const handleDragEndCategory = useCallback(() => {
    setDraggedCategory(null);
    setDragOverCategory(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x' && e.altKey) {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        onDateChange(prevDay);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        onDateChange(nextDay);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, onDateChange]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h1>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                onDateChange(prevDay);
              }}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => onDateChange(new Date())}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                onDateChange(nextDay);
              }}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </header>

        {/* Daily Note */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Daily Note</h2>
          <textarea
            value={generalNote}
            onChange={handleNoteChange}
            placeholder="What's on your mind today? Your goals, thoughts, ideas..."
            className="w-full h-48 p-4 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
          />
        </section>

        {/* Tasks by Category */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Tasks</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Add Task (Alt+X)</span>
            </button>
          </div>

          {categories && Object.keys(todosByCategory).length > 0 ? (
            orderedCategoryNames.map(categoryName => {
              const category = categories.find(c => c.name === categoryName);
              return (
                <div
                  key={categoryName}
                  draggable
                  onDragStart={(e) => handleDragStartCategory(e, categoryName)}
                  onDragOver={(e) => handleDragOverCategory(e, categoryName)}
                  onDragLeave={handleDragLeaveCategory}
                  onDrop={(e) => handleDropCategory(e, categoryName)}
                  onDragEnd={handleDragEndCategory}
                  className={`transition-all duration-200 ease-out transform ${
                    draggedCategory === categoryName 
                      ? 'opacity-40 scale-95' 
                      : dragOverCategory === categoryName && draggedCategory
                      ? 'border-l-4 border-blue-500 pl-2 bg-gray-800 bg-opacity-30 rounded-lg my-2'
                      : ''
                  }`}
                >
                  <CategorySection
                    category={category || { name: categoryName, color_code: '#6B7280', created_at: new Date().toISOString() }}
                    todos={todosByCategory[categoryName]}
                    onToggleComplete={handleToggleComplete}
                    onMoveToTomorrow={handleMoveToTomorrow}
                    onDelete={handleDeleteTask}
                    onReorderTodos={(reorderedTodos) => handleReorderTodos(categoryName, reorderedTodos)}
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </section>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
          categories={categories || []}
        />
      </div>
    </div>
  );
}
