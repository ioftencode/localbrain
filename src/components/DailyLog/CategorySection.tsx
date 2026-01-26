'use client';

import { type Todo, type Category } from '@/lib/database/db';
import { FiCheck, FiChevronRight, FiTrash2 } from 'react-icons/fi';

interface CategorySectionProps {
  category: Category;
  todos: Todo[];
  onToggleComplete: (taskId: string) => void;
  onMoveToTomorrow: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function CategorySection({
  category,
  todos,
  onToggleComplete,
  onMoveToTomorrow,
  onDelete,
}: CategorySectionProps) {
  if (todos.length === 0) return null;

  const completedCount = todos.filter(t => t.is_completed).length;

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

      <div className="space-y-2 ml-7">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                todo.is_completed
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-600 hover:border-green-500'
              }`}
            >
              {todo.is_completed && <FiCheck className="text-white" />}
            </button>

            <div className="flex-1">
              <p
                className={`${
                  todo.is_completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-100'
                }`}
              >
                {todo.task}
              </p>
              {todo.time_expected && (
                <p className="text-sm text-gray-500">⏱️ {todo.time_expected}</p>
              )}
            </div>

            <div className="hidden group-hover:flex gap-2">
              <button
                onClick={() => onMoveToTomorrow(todo.id)}
                className="p-2 hover:bg-gray-600 rounded transition-colors"
                title="Move to tomorrow"
              >
                <FiChevronRight className="text-blue-400" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 hover:bg-gray-600 rounded transition-colors"
                title="Delete task"
              >
                <FiTrash2 className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
