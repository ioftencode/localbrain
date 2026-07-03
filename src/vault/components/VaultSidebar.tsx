import React from 'react';
import { Note } from '../types';

interface VaultSidebarProps {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onToggleLock: (noteId: string, locked: boolean) => void;
  onTogglePin: (noteId: string, pinned: boolean) => void;
  onDeleteNote: (noteId: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLocked: boolean;
}

export const VaultSidebar: React.FC<VaultSidebarProps> = ({
  notes,
  searchQuery,
  setSearchQuery,
  onNewNote,
  onSelectNote,
  onToggleLock,
  onTogglePin,
  onDeleteNote,
  isOpen,
  setIsOpen,
  isLocked
}) => {
  const filteredNotes = notes
    .filter(n => {
      const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-[100] w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 ${isOpen ? 'translate-x-[320px]' : 'translate-x-0'}`}
        style={{ zIndex: 110 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M21 12H3M21 6H3M21 18H3" />
          )}
        </svg>
      </button>

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800 shadow-2xl z-[105] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-white ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Journal</h2>
            <button 
              onClick={onNewNote}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-white placeholder-gray-500"
            />
            <svg className="absolute left-3 top-3.5 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No entries found.
            </div>
          ) : (
            filteredNotes.map(note => {
              const isNoteLocked = note.locked && isLocked;
              return (
                <div 
                  key={note.id}
                  className="bg-gray-800/50 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-blue-600 hover:bg-gray-800 transition-all group relative"
                  onClick={() => onSelectNote(note)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white truncate pr-[4.5rem]">
                      {note.title || 'Untitled'}
                    </h3>
                    <div className="flex gap-1 absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onTogglePin(note.id, !note.pinned); }}
                        className={`p-1 rounded hover:bg-gray-700 ${note.pinned ? 'text-yellow-500' : 'text-gray-400'}`}
                        title="Pin entry"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={note.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleLock(note.id, !note.locked); }}
                        className={`p-1 rounded hover:bg-gray-700 ${note.locked ? 'text-red-500' : 'text-gray-400'}`}
                        title="Lock entry"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11ZM7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if (confirm('Are you sure you want to delete this entry?')) onDeleteNote(note.id); }}
                        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-500"
                        title="Delete entry"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {isNoteLocked ? (
                    <div className="flex items-center justify-center py-2 text-gray-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11ZM7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" />
                      </svg>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {note.content || 'No content...'}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    <div className="flex gap-1.5">
                      {note.pinned && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                           <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      )}
                      {note.locked && (
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11ZM7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" />
                         </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[104] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
