
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ProjectPlan from './pages/ProjectPlan';
import { Note } from './types';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notegenie_notes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('notegenie_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Note) => setNotes(prev => [note, ...prev]);
  const updateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 text-indigo-600 mb-8">
              <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">Online AI Notes</h1>
            </div>
            
            <div className="space-y-1">
              <NavLink to="/" icon="fa-chart-pie" label="Dashboard" />
              <NavLink to="/editor/new" icon="fa-plus-circle" label="New Note" />
              <NavLink to="/plan" icon="fa-file-lines" label="Project Plan" />
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-slate-100">
            <div className="bg-indigo-50 p-4 rounded-xl">
              <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">Status</p>
              <p className="text-sm text-slate-600">3rd Year B.Voc Dev</p>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 md:p-10">
            <Routes>
              <Route path="/" element={<Dashboard notes={notes} onDelete={deleteNote} />} />
              <Route path="/editor/:id" element={<Editor notes={notes} onSave={addNote} onUpdate={updateNote} />} />
              <Route path="/plan" element={<ProjectPlan />} />
            </Routes>
          </div>
        </main>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
          <Link to="/" className="flex flex-col items-center text-slate-500 hover:text-indigo-600">
            <i className="fa-solid fa-chart-pie text-xl"></i>
            <span className="text-[10px]">Dashboard</span>
          </Link>
          <Link to="/editor/new" className="flex flex-col items-center text-slate-500 hover:text-indigo-600">
            <i className="fa-solid fa-plus-circle text-xl"></i>
            <span className="text-[10px]">New</span>
          </Link>
          <Link to="/plan" className="flex flex-col items-center text-slate-500 hover:text-indigo-600">
            <i className="fa-solid fa-file-lines text-xl"></i>
            <span className="text-[10px]">Plan</span>
          </Link>
        </div>
      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <i className={`fa-solid ${icon}`}></i>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default App;
