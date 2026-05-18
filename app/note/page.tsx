"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAppStore } from "@/lib/store";
import type { Note, NoteFolder } from "@/types/database";

export default function NotePage() {
  const { notes, folders, loadAll, addFolder, deleteFolder, addNote, updateNote, deleteNote } = useAppStore();
  const [selectedFolder, setSelectedFolder] = useState<string | null | "all">("all");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteFolderId, setNewNoteFolderId] = useState<string | null>(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => { loadAll(); }, [loadAll]);

  const visibleNotes = selectedFolder === "all"
    ? notes
    : notes.filter((n) => n.folder_id === selectedFolder);

  const handleSaveEdit = async () => {
    if (!editingNote) return;
    await updateNote(editingNote.id, editingNote.title, editingNote.content);
    setEditingNote(null);
  };

  const handleAddNote = async () => {
    await addNote(newNoteTitle || "Sans titre", newNoteContent, newNoteFolderId);
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteFolderId(null);
    setNewNoteOpen(false);
  };

  const handleAddFolder = async () => {
    if (!folderName.trim()) return;
    await addFolder(folderName.trim());
    setFolderName("");
    setShowFolderInput(false);
  };

  // Full-screen note editor
  if (editingNote) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
          <button onClick={() => setEditingNote(null)} className="text-sm font-bold text-gray-500">Annuler</button>
          <h2 className="font-black text-sm">Note</h2>
          <button onClick={handleSaveEdit} className="text-sm font-black text-[#FF4500]">Sauvegarder</button>
        </div>
        <div className="flex-1 px-4 py-4 flex flex-col gap-3">
          <input
            value={editingNote.title}
            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
            placeholder="Titre"
            className="text-2xl font-black outline-none border-b border-gray-100 pb-2"
          />
          <textarea
            value={editingNote.content}
            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
            placeholder="Commence à écrire..."
            className="flex-1 text-base outline-none resize-none leading-relaxed"
            style={{ minHeight: "60vh" }}
            autoFocus
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="note" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Folder tabs */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100">
          <button
            onClick={() => setSelectedFolder("all")}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-black transition-all ${selectedFolder === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
          >
            Tout
          </button>
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setSelectedFolder(folder.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${selectedFolder === folder.id ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {folder.name}
              </button>
              <button
                onClick={() => deleteFolder(folder.id)}
                className="text-gray-300 text-base active:text-red-500 px-1"
              >×</button>
            </div>
          ))}
          {showFolderInput ? (
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                autoFocus
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
                placeholder="Nom du dossier"
                className="w-28 text-xs border-b border-black outline-none py-0.5"
              />
              <button onClick={handleAddFolder} className="text-[#FF4500] text-xs font-black">OK</button>
            </div>
          ) : (
            <button
              onClick={() => setShowFolderInput(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-400"
            >
              + Dossier
            </button>
          )}
        </div>

        {/* Notes grid */}
        <div className="flex-1 px-4 py-4 overflow-y-auto pb-28">
          {visibleNotes.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">Aucune note. Tape + pour commencer.</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {visibleNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setEditingNote(note)}
                className="bg-gray-50 rounded-2xl p-4 text-left relative group active:scale-95 transition-transform"
              >
                <h3 className="font-black text-sm leading-tight mb-1 line-clamp-1">{note.title || "Sans titre"}</h3>
                <p className="text-xs text-gray-500 line-clamp-4 leading-relaxed">{note.content || "Vide"}</p>
                <p className="text-[10px] text-gray-300 mt-2">{formatDate(note.updated_at)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="absolute top-2 right-2 text-gray-200 text-lg opacity-0 group-active:opacity-100 active:text-red-500"
                >×</button>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setNewNoteOpen(true)}
        className="fixed bottom-8 right-6 w-16 h-16 rounded-full text-white text-4xl flex items-center justify-center active:scale-90 transition-transform z-40 font-black"
        style={{ backgroundColor: "#FF4500", boxShadow: "0 4px 24px rgba(255,69,0,0.5)" }}
      >
        +
      </button>

      {/* New note modal */}
      {newNoteOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setNewNoteOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-black">Nouvelle note</h2>
            <input
              autoFocus
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Titre"
              className="w-full border-b-2 border-black py-2 text-base font-medium outline-none"
            />
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Contenu..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none resize-none"
            />
            {folders.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Dossier</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setNewNoteFolderId(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${!newNoteFolderId ? "bg-black text-white border-black" : "border-gray-200"}`}
                  >
                    Aucun
                  </button>
                  {folders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setNewNoteFolderId(f.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${newNoteFolderId === f.id ? "bg-black text-white border-black" : "border-gray-200"}`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleAddNote}
              className="w-full py-4 bg-[#FF4500] text-white font-black text-base rounded-2xl active:scale-95 transition-transform"
            >
              Créer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
