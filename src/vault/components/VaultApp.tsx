import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { storageService } from '../services/storageService';
import { vaultService } from '../services/vaultService';
import { VaultSidebar } from './VaultSidebar';
import { NoteModal } from './NoteModal';
import { PinPromptModal } from './PinPromptModal';

export const VaultApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    setNotes(storageService.getNotes());
    if (vaultService.isUnlocked()) {
      setIsVaultLocked(false);
    }
  }, []);

  const handleNewNote = () => {
    const newNote = storageService.createNote({
      title: '',
      content: '',
      locked: false,
      pinned: false,
      archived: false,
      favorite: false,
      tags: []
    });
    setNotes(storageService.getNotes());
    setSelectedNote(newNote);
  };

  const handleSelectNote = (note: Note) => {
    if (note.locked && isVaultLocked) {
      setPendingAction(() => () => setSelectedNote(note));
      setShowPinPrompt(true);
    } else {
      setSelectedNote(note);
    }
  };

  const handleToggleLock = (noteId: string, locked: boolean) => {
    if (locked && !vaultService.hasPin()) {
      setPendingAction(() => () => {
        const updated = storageService.updateNote(noteId, { locked });
        if (updated) setNotes(storageService.getNotes());
      });
      setShowPinPrompt(true);
      return;
    }

    if (locked && isVaultLocked) {
      setPendingAction(() => () => {
        const updated = storageService.updateNote(noteId, { locked });
        if (updated) setNotes(storageService.getNotes());
      });
      setShowPinPrompt(true);
      return;
    }

    const updated = storageService.updateNote(noteId, { locked });
    if (updated) {
      setNotes(storageService.getNotes());
    }
  };

  const handleTogglePin = (noteId: string, pinned: boolean) => {
    const updated = storageService.updateNote(noteId, { pinned });
    if (updated) {
      setNotes(storageService.getNotes());
    }
  };

  const handleNoteUpdate = (updated: Note) => {
    setNotes(storageService.getNotes());
    if (selectedNote && selectedNote.id === updated.id) {
      setSelectedNote(updated);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    storageService.deleteNote(noteId);
    setNotes(storageService.getNotes());
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handlePinSuccess = () => {
    setShowPinPrompt(false);
    setIsVaultLocked(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <>
      <VaultSidebar 
        notes={notes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewNote={handleNewNote}
        onSelectNote={handleSelectNote}
        onToggleLock={handleToggleLock}
        onTogglePin={handleTogglePin}
        onDeleteNote={handleDeleteNote}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLocked={isVaultLocked}
      />
      
      {selectedNote && (
        <NoteModal 
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleNoteUpdate}
          onDelete={handleDeleteNote}
        />
      )}

      {showPinPrompt && (
        <PinPromptModal 
          onSuccess={handlePinSuccess}
          onCancel={() => {
            setShowPinPrompt(false);
            setPendingAction(null);
          }}
        />
      )}
    </>
  );
};
export default VaultApp;
