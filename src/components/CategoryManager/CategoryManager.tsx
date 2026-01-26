'use client';

import { useState } from 'react';
import { db } from '@/lib/database/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function CategoryManager() {
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [colorCode, setColorCode] = useState('#3B82F6');

  const categories = useLiveQuery(() => db.categories.toArray(), []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    await db.categories.put({
      name: categoryName.trim(),
      color_code: colorCode,
      created_at: new Date().toISOString()
    });

    setCategoryName('');
    setColorCode('#3B82F6');
    setShowForm(false);
  };

  const handleDeleteCategory = async (name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      await db.categories.delete(name);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCategory} className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="space-y-4">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2 bg-gray-600 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3 items-center">
              <label className="text-sm">Color:</label>
              <input
                type="color"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {categories?.map(cat => (
          <div key={cat.name} className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: cat.color_code }}
              />
              <span>{cat.name}</span>
            </div>
            <button
              onClick={() => handleDeleteCategory(cat.name)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
