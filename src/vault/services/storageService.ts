import { Note } from '../types';

const STORAGE_KEY = 'vault_notes';

export const storageService = {
  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse notes from localStorage', e);
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  },

  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const notes = storageService.getNotes();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.push(newNote);
    storageService.saveNotes(notes);
    return newNote;
  },

  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null => {
    const notes = storageService.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    const updatedNote = { ...notes[index], ...updates, updatedAt: Date.now() };
    notes[index] = updatedNote;
    storageService.saveNotes(notes);
    return updatedNote;
  },

  deleteNote: (id: string): void => {
    const notes = storageService.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    storageService.saveNotes(filtered);
  }
};
