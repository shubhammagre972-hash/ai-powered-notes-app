
import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../types';

interface DashboardProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ notes, onDelete }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Lecture Repository</h2>
        <p className="text-slate-500 mt-2">Manage your academic journey with AI-driven insights.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Notes" value={notes.length} icon="fa-book" color="bg-blue-500" />
        <StatCard title="AI Summaries" value={notes.filter(n => n.summary).length} icon="fa-bolt" color="bg-amber-500" />
        <StatCard title="Avg Understanding" value={notes.length ? (notes.reduce((acc, curr) => acc + (curr.understandingRating || 0), 0) / notes.length).toFixed(1) : 'N/A'} icon="fa-brain" color="bg-emerald-500" />
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-800">Recent Notes</h3>
          <Link to="/editor/new" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
            Add Note <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-note-sticky text-2xl text-slate-300"></i>
            </div>
            <h4 className="text-lg font-medium text-slate-600">No notes found</h4>
            <p className="text-slate-400 mt-1 mb-6">Start your academic edge by creating your first AI-powered lecture note.</p>
            <Link to="/editor/new" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
              Create Note
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map(note => (
              <div key={note.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {note.categories.map(cat => (
                      <span key={cat} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => onDelete(note.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                
                <Link to={`/editor/${note.id}`}>
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{note.title}</h4>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{note.content}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-xs text-slate-400">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </span>
                    {note.understandingRating && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <i key={star} className={`fa-solid fa-star text-[10px] ${star <= note.understandingRating! ? 'text-amber-400' : 'text-slate-200'}`}></i>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
