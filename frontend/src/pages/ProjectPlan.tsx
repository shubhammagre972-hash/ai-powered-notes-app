
import React from 'react';

const ProjectPlan: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-700">
      <div className="bg-indigo-600 p-10 text-white">
        <h2 className="text-4xl font-black mb-4">Project Charter</h2>
        <p className="text-indigo-100 max-w-2xl text-lg">
          AI-Powered Notes Assistant for B.Voc Software Development Placement Enhancement.
        </p>
      </div>

      <div className="p-10 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</span>
            <h3 className="text-2xl font-bold text-slate-800">User Interface Wireframes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WireframeBox title="Dashboard" items={['Quick Stats View', 'Note Categorization Filter', 'Recent Lectures Grid']} />
            <WireframeBox title="AI Editor" items={['Real-time Voice Transcription Pane', 'AI Summary Sidebar', 'Resources Recommendation Popover']} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</span>
            <h3 className="text-2xl font-bold text-slate-800">Features & User Stories</h3>
          </div>
          <div className="space-y-4">
            <UserStory icon="fa-user-graduate" title="Lecture Capture" desc="As a student, I want to record my lectures and see them transcribed with timestamps so I don't miss key details." />
            <UserStory icon="fa-microchip" title="AI Distillation" desc="As a student, I want a bulleted summary of long lectures so I can review concepts quickly before exams." />
            <UserStory icon="fa-chart-line" title="Feedback Loop" desc="As a student, I want to rate my understanding so the system can suggest extra learning materials for hard topics." />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</span>
            <h3 className="text-2xl font-bold text-slate-800">API Specifications</h3>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 pr-4 font-bold text-slate-400">Endpoint</th>
                  <th className="pb-3 pr-4 font-bold text-slate-400">Method</th>
                  <th className="pb-3 font-bold text-slate-400">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100"><td className="py-3 font-mono">/api/summarize</td><td className="py-3">POST</td><td>Gemini integration for lecture summarization.</td></tr>
                <tr className="border-b border-slate-100"><td className="py-3 font-mono">/api/categorize</td><td className="py-3">POST</td><td>Smart tagging and metadata generation.</td></tr>
                <tr className="border-b border-slate-100"><td className="py-3 font-mono">/api/resources</td><td className="py-3">GET</td><td>Recommendation algorithm for topic-based learning.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">4</span>
            <h3 className="text-2xl font-bold text-slate-800">Development Timeline</h3>
          </div>
          <div className="relative pl-8 border-l-2 border-indigo-100 space-y-8">
            <TimelineItem week="1-2" title="Design & Core Setup" desc="UI wireframing, React project initialization, and Tailwind layout setup." />
            <TimelineItem week="3-4" title="AI Integration" desc="Connecting Gemini API, building the Voice-to-Text module, and refinement." />
            <TimelineItem week="5-6" title="Feedback & Deployment" desc="Real-time rating system, resource suggestion logic, and Vercel/Render hosting." />
          </div>
        </section>
      </div>
    </div>
  );
};

const WireframeBox: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
      <i className="fa-solid fa-layer-group text-indigo-500"></i>
      {title}
    </h4>
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item} className="flex items-center gap-2 text-sm text-slate-500">
          <i className="fa-solid fa-check text-xs text-emerald-500"></i>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const UserStory: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TimelineItem: React.FC<{ week: string; title: string; desc: string }> = ({ week, title, desc }) => (
  <div className="relative">
    <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
    <div className="flex items-center justify-between mb-1">
      <h4 className="font-bold text-slate-800">{title}</h4>
      <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">{week}</span>
    </div>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

export default ProjectPlan;
