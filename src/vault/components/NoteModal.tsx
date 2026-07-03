import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { storageService } from '../services/storageService';

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  onUpdate: (updated: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = window.setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        const updated = storageService.updateNote(note.id, { title, content });
        if (updated) {
          onUpdate(updated);
        }
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, isEditing, note.id, note.title, note.content, onUpdate]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                Edit Entry
              </button>
            ) : (
              <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Autosaving...
              </span>
            )}
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to delete this entry?')) {
                  onDelete(note.id);
                }
              }}
              className="px-4 py-2 text-sm font-medium bg-red-950/40 hover:bg-red-900/60 border border-red-900 text-red-400 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
          <button 
            onClick={() => {
              if (isEditing) {
                const updated = storageService.updateNote(note.id, { title, content });
                if (updated) onUpdate(updated);
              }
              onClose();
            }}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="text-3xl md:text-5xl font-bold border-none outline-none bg-transparent placeholder-gray-600 w-full text-white"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing..."
                className="flex-1 w-full text-lg leading-relaxed text-gray-200 border-none outline-none bg-transparent resize-none placeholder-gray-600 min-h-[300px]"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-bold text-white">{title || 'Untitled'}</h1>
              <div className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                {content || <span className="text-gray-500 italic">Empty entry</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
