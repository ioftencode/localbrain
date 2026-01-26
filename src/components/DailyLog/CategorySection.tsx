'use client';

import { type Todo, type Category } from '@/lib/database/db';
import { FiCheck, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { useState } from 'react';

interface CategorySectionProps {
  category: Category;
  todos: Todo[];
  onToggleComplete: (taskId: string) => void;
  onMoveToTomorrow: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onReorderTodos: (reorderedTodos: Todo[]) => void;
}

export default function CategorySection({
  category,
  todos,
  onToggleComplete,
  onMoveToTomorrow,
  onDelete,
  onReorderTodos,
}: CategorySectionProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  let dragFromIndex = -1;

  const completedCount = todos.filter(t => t.is_completed).length;

  const handleDragStart = (index: number, id: string) => {
    dragFromIndex = index;
    setDraggedId(id);
  };

  const handleDragOver = (index: number) => {
    setOverIndex(index);
  };

  const handleDrop = (toIndex: number) => {
    if (dragFromIndex === -1 || dragFromIndex === toIndex) {
      setDraggedId(null);
      setOverIndex(null);
      return;
    }

    const newTodos = [...todos];
    const item = newTodos[dragFromIndex];
    newTodos.splice(dragFromIndex, 1);
    newTodos.splice(toIndex, 0, item);

    const updated = newTodos.map((t, i) => ({ ...t, order: i }));
    onReorderTodos(updated);
    
    setDraggedId(null);
    setOverIndex(null);
    dragFromIndex = -1;
  };

  if (todos.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color_code }}
        />
        <h3 className="text-lg font-semibold">
          {category.name}
          <span className="text-sm text-gray-400 ml-2">
            ({completedCount}/{todos.length})
          </span>
        </h3>
      </div>

      <div className="ml-7">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            draggable
            onDragStart={() => handleDragStart(index, todo.id)}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOver(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(index);
            }}
            onDragLeave={() => setOverIndex(null)}
            onDragEnd={() => {
              setDraggedId(null);
              setOverIndex(null);
            }}
            className={`flex items-center gap-3 p-3 bg-gray-800 rounded mb-2 cursor-move
              ${draggedId === todo.id ? 'bg-gray-700 opacity-60' : ''}
              ${overIndex === index && draggedId ? 'bg-blue-900 border-2 border-blue-500' : ''}
            `}
          >
            <MdDragIndicator size={20} className="text-gray-600" />

            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                todo.is_completed
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-600'
              }`}
            >
              {todo.is_completed && <FiCheck className="text-white" size={16} />}
            </button>

            <div className="flex-1">
              <p className={todo.is_completed ? 'line-through text-gray-500' : 'text-gray-100'}>
                {todo.task}
              </p>
              {todo.time_expected && (
                <p className="text-xs text-gray-500">⏱️ {todo.time_expected}</p>
              )}
            </div>

            <button
              onClick={() => onMoveToTomorrow(todo.id)}
              className="p-2 hover:bg-gray-600 rounded"
              title="Move to tomorrow"
            >
              <FiChevronRight className="text-blue-400" size={18} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 hover:bg-gray-600 rounded"
              title="Delete"
            >
              <FiTrash2 className="text-red-400" size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
