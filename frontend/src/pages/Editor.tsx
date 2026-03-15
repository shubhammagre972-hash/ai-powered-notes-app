
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Note, Resource } from '../types';
import { summarizeNote, categorizeNote, getSuggestedResources } from '../services/geminiService';

interface EditorProps {
  notes: Note[];
  onSave: (note: Note) => void;
  onUpdate: (note: Note) => void;
}

const Editor: React.FC<EditorProps> = ({ notes, onSave, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [resources, setResources] = useState<Resource[]>([]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isNew) {
      const existing = notes.find(n => n.id === id);
      if (existing) {
        setTitle(existing.title);
        setContent(existing.content);
        setSummary(existing.summary);
        setCategories(existing.categories);
        setRating(existing.understandingRating);
        setResources(existing.suggestedResources || []);
      }
    }
  }, [id, isNew, notes]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setContent(prev => prev + (prev ? '\n' : '') + `[${new Date().toLocaleTimeString()}] ` + transcript);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    }
  };

  const handleAIServices = async () => {
    if (!content) return;
    setIsProcessing(true);
    try {
      const [aiSummary, aiCategories] = await Promise.all([
        summarizeNote(content),
        categorizeNote(content)
      ]);
      setSummary(aiSummary || '');
      setCategories(aiCategories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRating = async (val: number) => {
    setRating(val);
    if (val < 4) {
      const suggested = await getSuggestedResources(title || content.substring(0, 30), val);
      setResources(suggested);
    } else {
      setResources([]);
    }
  };

  const save = () => {
    const noteData: Note = {
      id: isNew ? Math.random().toString(36).substr(2, 9) : id!,
      title: title || 'Untitled Note',
      content,
      summary,
      categories,
      timestamp: Date.now(),
      understandingRating: rating,
      suggestedResources: resources,
    };

    if (isNew) {
      onSave(noteData);
    } else {
      onUpdate(noteData);
    }
    navigate('/');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Lecture Title..."
            className="text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder-slate-400 text-slate-900 flex-1 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all shadow-md ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <i className={`fa-solid ${isRecording ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
              {isRecording ? 'Stop' : 'Record'}
            </button>
            <button
              onClick={save}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Save
            </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[500px] flex flex-col">
          <textarea
            className="flex-1 w-full bg-transparent border-none focus:ring-0 text-slate-700 leading-relaxed text-lg resize-none outline-none"
            placeholder="Type or record your lecture notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <div className="flex gap-2">
              {categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-tight">
                  {cat}
                </span>
              ))}
            </div>
            <button
              onClick={handleAIServices}
              disabled={isProcessing || !content}
              className={`flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors`}
            >
              <i className={`fa-solid ${isProcessing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
              {isProcessing ? 'Generating AI Insights...' : 'Generate AI Insights'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* AI Summary Panel */}
        <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-sparkles text-amber-300"></i>
            <h3 className="text-lg font-bold">AI Summary</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-h-[100px] text-indigo-50 text-sm leading-relaxed whitespace-pre-line">
            {summary || "Generate a summary to see the key highlights of this lecture."}
          </div>
        </section>

        {/* Feedback Panel */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Understanding</h3>
          <p className="text-sm text-slate-500 mb-6">How well did you grasp this lecture?</p>
          
          <div className="flex justify-between items-center px-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`text-2xl transition-transform hover:scale-125 ${
                  rating && star <= rating ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                <i className="fa-solid fa-star"></i>
              </button>
            ))}
          </div>

          {rating !== undefined && rating < 4 && resources.length > 0 && (
            <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Boosts</h4>
              {resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className={`fa-solid ${res.type === 'video' ? 'fa-play' : res.type === 'book' ? 'fa-book' : 'fa-file-lines'}`}></i>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-700 truncate">{res.title}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{res.type}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-indigo-400"></i>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Editor;
