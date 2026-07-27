import React, { useState } from 'react';
import { ReminderItem, CategoryType, BusinessSponsor } from '../types';
import { CheckCircle2, Circle, Trash2, Tag, Gift, ExternalLink, MapPin, Copy, Check, Plus, Clock, Sparkles, Mic, MicOff, Send } from 'lucide-react';
import { speechController } from '../utils/speech';

interface ReminderListProps {
  reminders: ReminderItem[];
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddReminder: (title: string, category: CategoryType, time: string) => void;
  onClaimSponsorPerk: (sponsorId: string) => void;
  onVoiceCommandSubmitted?: (cmd: string) => void;
  onOpenVoiceModal?: () => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onToggleComplete,
  onDeleteReminder,
  onAddReminder,
  onClaimSponsorPerk,
  onVoiceCommandSubmitted,
  onOpenVoiceModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [claimedPerkId, setClaimedPerkId] = useState<string | null>(null);

  // Quick Inline Data Entry & Voice State
  const [taskInput, setTaskInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceCategory, setVoiceCategory] = useState<CategoryType>('Personal');

  // Manual Add Modal Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('Personal');
  const [newTime, setNewTime] = useState('Today at 4:00 PM');

  const categories = ['All', 'Work', 'Personal', 'Health', 'Finance', 'Shopping', 'Completed'];

  const handleToggleListening = () => {
    if (isListening) {
      speechController.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechController.startListening({
        onResult: (transcript, isFinal) => {
          setTaskInput(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    
    if (onVoiceCommandSubmitted) {
      onVoiceCommandSubmitted(taskInput);
    } else {
      onAddReminder(taskInput, voiceCategory, 'Today at 5:00 PM');
    }
    setTaskInput('');
  };

  const filteredReminders = reminders.filter(item => {
    if (selectedCategory === 'All') return !item.completed;
    if (selectedCategory === 'Completed') return item.completed;
    return !item.completed && item.category === selectedCategory;
  });

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleClaimPerkClick = (sponsor: BusinessSponsor) => {
    onClaimSponsorPerk(sponsor.id);
    setClaimedPerkId(sponsor.id);
    setTimeout(() => setClaimedPerkId(null), 3500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder(newTitle, newCategory, newTime);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div id="task-list-section" className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl scroll-mt-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Daily Tasks & Reminders</h3>
            <span className="px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800 text-xs font-semibold shrink-0 whitespace-nowrap">
              {reminders.filter(r => !r.completed).length} Pending {reminders.filter(r => !r.completed).length === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Type or tap the microphone to add a task with automatic local merchant perks.
          </p>
        </div>

        <button
          id="btn-open-add-reminder"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700 shrink-0"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Advanced Add</span>
        </button>
      </div>

      {/* Primary Data Entry Bar with Minimized Microphone Beside Input */}
      <div className="pt-4 pb-2">
        <form onSubmit={handleQuickSubmit} className="relative flex items-center gap-2">
          
          {/* Enriched Microphone Button Beside Input - Matches Picture 2 */}
          <button
            type="button"
            id="btn-minimized-mic-data-entry"
            onClick={onOpenVoiceModal ? onOpenVoiceModal : handleToggleListening}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-xl group relative border ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-500/50 animate-pulse border-rose-400'
                : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/40 ring-2 ring-cyan-400/30 hover:ring-cyan-300/60 hover:scale-105 active:scale-95 border-cyan-300/30'
            }`}
            title="Tap to open Voice Assistant and speak your command"
          >
            <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-slate-950"></span>
            </span>
          </button>

          {/* Text Input Field */}
          <div className="relative flex-1">
            <input
              id="input-quick-data-entry"
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder={isListening ? 'Listening... Speak your task now...' : 'Type or speak task'}
              className={`w-full bg-slate-950 border rounded-xl pl-4 pr-10 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                isListening
                  ? 'border-rose-500 ring-2 ring-rose-500/30'
                  : 'border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
              }`}
            />
            {isListening && (
              <span className="absolute right-3 top-3.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </div>

          {/* Quick Submit Button */}
          <button
            id="btn-submit-quick-entry"
            type="submit"
            disabled={!taskInput.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </form>
      </div>

      {/* Manual Add Task Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase">Create New Reminder</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <div>
            <input
              id="input-new-reminder-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Buy morning coffee at Artisan Roast..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Category</label>
              <select
                id="select-new-reminder-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Scheduled Time</label>
              <input
                id="input-new-reminder-time"
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>
          <button
            id="btn-submit-new-reminder"
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Save Reminder
          </button>
        </form>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 my-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-cat-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Claim Toast Notice */}
      {claimedPerkId && (
        <div className="p-3 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span><strong>Coupon Claimed!</strong> Show promo code at checkout or present this voucher to the local merchant.</span>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-4 mt-2">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No reminders found in this view.</p>
            <p className="text-xs text-slate-500 mt-1">Speak to TaTa or click "Add Task" to create one!</p>
          </div>
        ) : (
          filteredReminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Task Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    id={`btn-complete-task-${item.id}`}
                    onClick={() => onToggleComplete(item.id)}
                    className="mt-0.5 text-slate-500 hover:text-cyan-400 transition-colors shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-semibold text-slate-100 ${item.completed ? 'line-through text-slate-500' : ''}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-delete-task-${item.id}`}
                  onClick={() => onDeleteReminder(item.id)}
                  className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* SPONSORED BUSINESS PROMO CARD EMBEDDED */}
              {item.matchedSponsor && !item.completed && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 border border-amber-800/50 relative overflow-hidden">
                  
                  {/* Business Sponsor Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.matchedSponsor.logo}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-300">
                            {item.matchedSponsor.businessName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-extrabold uppercase">
                            Sponsored Perk
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {item.matchedSponsor.locationName}
                        </span>
                      </div>
                    </div>

                    {item.matchedSponsor.discountPct && (
                      <span className="text-xs font-black text-amber-300 px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-700">
                        {item.matchedSponsor.discountPct}
                      </span>
                    )}
                  </div>

                  {/* Promo details */}
                  <p className="text-xs text-slate-300 font-semibold mt-2">
                    {item.matchedSponsor.offerTitle}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {item.matchedSponsor.offerDescription}
                  </p>

                  {/* Coupon Code & Claim Action */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-amber-900/40">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Code:</span>
                      <code className="text-xs font-mono font-bold bg-slate-950 px-2 py-0.5 rounded text-amber-300 border border-amber-900">
                        {item.matchedSponsor.promoCode}
                      </code>
                      <button
                        id={`btn-copy-code-${item.id}`}
                        onClick={() => handleCopyCode(item.matchedSponsor!.promoCode, item.id)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                        title="Copy promo code"
                      >
                        {copiedCodeId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <button
                      id={`btn-claim-perk-${item.id}`}
                      onClick={() => handleClaimPerkClick(item.matchedSponsor!)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Claim Perk Voucher</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
