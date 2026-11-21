import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search, 
  CheckCircle2, 
  X, 
  HandHeart, 
  ShieldCheck, 
  Check, 
  Send, 
  Video, 
  Filter 
} from 'lucide-react';
import { CompanyEvent, EventContributionRequest, ContributionCategory } from '../../types';
import { eventsService } from '../../services/eventsService';

interface EventsModuleProps {
  currentUserId?: string;
  userRole?: string;
}

export const EventsModule: React.FC<EventsModuleProps> = ({ 
  currentUserId = 'usr_alex_rivera',
  userRole: _userRole = 'employee'
}) => {
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [contributions, setContributions] = useState<EventContributionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past' | 'registered' | 'contributions' | 'history'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<CompanyEvent | null>(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Contribution Form State
  const [contribCategory, setContribCategory] = useState<ContributionCategory>('Technical Session Coordination');
  const [contribSkills, setContribSkills] = useState('');
  const [contribDescription, setContribDescription] = useState('');
  const [contribAvailability, setContribAvailability] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const evts = await eventsService.getEvents();
    const reqs = await eventsService.getContributionRequests();
    setEvents(evts);
    setContributions(reqs);
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Filter logic
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;

    if (!matchesSearch || !matchesCategory) return false;

    if (activeTab === 'upcoming') return evt.status === 'upcoming';
    if (activeTab === 'ongoing') return evt.status === 'ongoing';
    if (activeTab === 'past') return evt.status === 'completed';
    if (activeTab === 'registered') return evt.isRegistered;
    if (activeTab === 'history') return evt.userAttended;
    return true;
  });

  const handleRegister = async (event: CompanyEvent) => {
    const res = await eventsService.registerForEvent(event.id, currentUserId);
    if (res.success) {
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 } : e));
      if (selectedEvent?.id === event.id) {
        setSelectedEvent(prev => prev ? { ...prev, isRegistered: true, registeredCount: prev.registeredCount + 1 } : null);
      }
      showNotification(`Successfully registered for "${event.title}"! Remember: attendance is verified separately on event day.`);
    }
  };

  const handleVerifyAttendance = async (event: CompanyEvent) => {
    const res = await eventsService.verifyAndRecordAttendance(event.id, currentUserId, event.title);
    if (res.success) {
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, userAttended: true } : e));
      if (selectedEvent?.id === event.id) {
        setSelectedEvent(prev => prev ? { ...prev, userAttended: true } : null);
      }
      showNotification(res.message);
    }
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsSubmitting(true);

    const skillsArray = contribSkills.split(',').map(s => s.trim()).filter(Boolean);
    const res = await eventsService.requestToContribute({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      employeeId: currentUserId,
      employeeName: 'Alex Rivera',
      employeeEmail: 'alex.rivera@nexustech.io',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      department: 'Engineering & Platform',
      contributionCategory: contribCategory,
      relevantSkills: skillsArray,
      description: contribDescription,
      availability: contribAvailability,
    });

    setIsSubmitting(false);
    if (res.success) {
      setShowContributeModal(false);
      setContribDescription('');
      setContribSkills('');
      setContribAvailability('');
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, userContributionStatus: 'pending' } : e));
      await loadData();
      showNotification(`Contribution request submitted to ${selectedEvent.organizerName}. You will receive a notification once reviewed.`);
    }
  };

  const handleUpdateContributionStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    const res = await eventsService.updateContributionStatus(requestId, status, status === 'approved' ? 'Assigned Contributor' : undefined, 'Reviewed by Event Organizer');
    if (res.success) {
      setContributions(prev => prev.map(c => c.id === requestId ? { ...c, status } : c));
      showNotification(`Request marked as ${status}.`);
    }
  };

  const categories = ['All', 'Technical Meetup', 'Hackathon', 'Workshop', 'Company Celebration', 'Seminar'];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-blue-950/40 border-blue-500/40 text-cyan-300'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <p className="text-xs font-medium">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-400 border border-blue-500/20">
              Company Domain
            </span>
            <span className="text-xs text-[#94A3B8]">• Organizational Engagement</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mt-1.5 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Events & Knowledge Summits
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Discover internal technical meetups, hackathons, and seminars. Register, contribute your skills, and verify event participation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#080D1B] border border-[#1E293B] text-center">
            <span className="block text-[10px] uppercase font-bold text-[#64748B]">My Registrations</span>
            <span className="text-lg font-extrabold text-cyan-400">
              {events.filter(e => e.isRegistered).length}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#080D1B] border border-[#1E293B] text-center">
            <span className="block text-[10px] uppercase font-bold text-[#64748B]">Active Contributions</span>
            <span className="text-lg font-extrabold text-blue-400">
              {contributions.filter(c => c.status === 'approved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#10182A] border border-[#1E293B]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Upcoming Events ({events.filter(e => e.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ongoing'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Ongoing ({events.filter(e => e.status === 'ongoing').length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'past'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'registered'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            My Registered
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contributions'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Contribution Requests ({contributions.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Participation History
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, keywords..."
              className="w-full bg-[#10182A] text-xs text-[#F8FAFC] placeholder-[#64748B] pl-9 pr-3 py-2 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills (for event tabs) */}
      {activeTab !== 'contributions' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] text-[#64748B] flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-[#10182A] text-[#94A3B8] border border-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* TAB CONTENT: CONTRIBUTION REQUESTS REVIEW DASHBOARD */}
      {activeTab === 'contributions' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3">
            <HandHeart className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#F8FAFC]">Organizer Contribution Hub</span>
              <p className="text-[#94A3B8]">
                Review employee applications to help organize, host, or coordinate events. As an event organizer, you can approve requests, assign roles, and allocate responsibilities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contributions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#10182A] border border-[#1E293B]">
                <HandHeart className="w-8 h-8 mx-auto text-[#64748B] mb-2" />
                <p className="text-sm font-semibold text-[#F8FAFC]">No contribution requests submitted yet.</p>
                <p className="text-xs text-[#94A3B8] mt-1">When employees offer to assist with events, their profiles will appear here for review.</p>
              </div>
            ) : (
              contributions.map((req) => (
                <div key={req.id} className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4 hover:border-blue-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
                    <div className="flex items-center gap-3">
                      <img src={req.employeeAvatar} alt={req.employeeName} className="w-10 h-10 rounded-xl object-cover border border-[#1E293B]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#F8FAFC]">{req.employeeName}</h4>
                          <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40">
                            {req.employeeId}
                          </span>
                        </div>
                        <p className="text-xs text-[#94A3B8]">{req.department} • {req.employeeEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#64748B] block font-medium">Target Event:</span>
                      <span className="text-[#F8FAFC] font-semibold">{req.eventTitle}</span>

                      <span className="text-[#64748B] block font-medium mt-2">Proposed Contribution:</span>
                      <span className="text-cyan-300 font-semibold">{req.contributionCategory}</span>
                    </div>

                    <div>
                      <span className="text-[#64748B] block font-medium">Availability:</span>
                      <span className="text-[#F8FAFC]">{req.availability}</span>

                      <span className="text-[#64748B] block font-medium mt-2">Relevant Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {req.relevantSkills.map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#151F35] text-cyan-300 text-[10px] border border-blue-500/20">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] text-xs">
                    <span className="text-[#64748B] block font-semibold mb-1">Employee's Message:</span>
                    <p className="text-[#94A3B8] italic">"{req.description}"</p>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleUpdateContributionStatus(req.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-950/30 text-xs font-semibold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleUpdateContributionStatus(req.id, 'approved')}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold hover:shadow-lg transition-all"
                      >
                        Approve & Assign Role
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* TAB CONTENT: EVENT CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl bg-[#10182A] border border-[#1E293B]">
              <Calendar className="w-8 h-8 mx-auto text-[#64748B] mb-2" />
              <p className="text-sm font-semibold text-[#F8FAFC]">No events found matching current criteria.</p>
              <p className="text-xs text-[#94A3B8] mt-1">Try switching tabs or resetting your search filter.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div 
                key={evt.id}
                className="rounded-2xl bg-[#10182A] border border-[#1E293B] flex flex-col justify-between overflow-hidden hover:border-blue-500/40 hover:shadow-dark-md transition-all group"
              >
                <div>
                  {/* Category & Status Bar */}
                  <div className="p-4 pb-0 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                      {evt.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      evt.status === 'ongoing' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                      evt.status === 'upcoming' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-slate-500/10 text-[#94A3B8]'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="p-4 space-y-2">
                    <h3 
                      onClick={() => setSelectedEvent(evt)}
                      className="text-sm font-bold text-[#F8FAFC] group-hover:text-cyan-300 cursor-pointer transition-colors line-clamp-2"
                    >
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Metadata block */}
                  <div className="px-4 py-2 space-y-2 text-xs border-y border-[#1E293B]/60 bg-[#080D1B]/50">
                    <div className="flex items-center gap-2 text-[#94A3B8]">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{new Date(evt.startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(evt.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#94A3B8]">
                      {evt.isOnline ? (
                        <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className="truncate">{evt.venueOrLink}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#94A3B8]">
                      <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{evt.registeredCount} Registered {evt.maxAttendees ? `/ ${evt.maxAttendees} max` : ''}</span>
                    </div>
                  </div>

                  {/* Opportunities */}
                  {evt.availableOpportunities.length > 0 && (
                    <div className="p-4 py-3 bg-[#10182A]">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1.5">
                        Volunteer Opportunities:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {evt.availableOpportunities.slice(0, 2).map((opp, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#151F35] text-cyan-300 border border-blue-500/20 truncate max-w-[200px]">
                            {opp}
                          </span>
                        ))}
                        {evt.availableOpportunities.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#151F35] text-[#94A3B8]">
                            +{evt.availableOpportunities.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-2 border-t border-[#1E293B] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Register button */}
                    {evt.isRegistered ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" /> Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-blue-glow"
                      >
                        Register
                      </button>
                    )}

                    {/* Contribute Button */}
                    <button
                      onClick={() => {
                        setSelectedEvent(evt);
                        setShowContributeModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#151F35] hover:bg-[#19253F] border border-[#1E293B] text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Request to volunteer skills for this event"
                    >
                      <HandHeart className="w-3 h-3 text-cyan-400" />
                      <span>Contribute</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EVENT DETAILS MODAL / SLIDE-OVER */}
      {selectedEvent && !showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#080D1B] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1E293B] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                    {selectedEvent.category}
                  </span>
                  <span className="text-xs text-[#94A3B8]">Organized by {selectedEvent.organizerName}</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-[#F8FAFC] mt-1.5">
                  {selectedEvent.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Event Description */}
              <div>
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] mb-2">
                  About this Event
                </h4>
                <p className="text-[#F8FAFC] leading-relaxed text-sm">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Time, Venue, Registration Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#10182A] border border-[#1E293B]">
                <div>
                  <span className="text-[#64748B] block font-medium">Date & Time:</span>
                  <span className="text-[#F8FAFC] font-semibold">
                    {new Date(selectedEvent.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Venue / Streaming Link:</span>
                  <span className="text-cyan-300 font-semibold">{selectedEvent.venueOrLink}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Registration Deadline:</span>
                  <span className="text-[#F8FAFC]">
                    {new Date(selectedEvent.registrationDeadline).toLocaleDateString([], { dateStyle: 'medium' })}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Attendance Verified:</span>
                  <span className={selectedEvent.userAttended ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {selectedEvent.userAttended ? 'Verified Present (Synced with Work Attendance)' : 'Pending Event Day Check-in'}
                  </span>
                </div>
              </div>

              {/* Schedule & Agenda */}
              {selectedEvent.scheduleAgenda.length > 0 && (
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] mb-2">
                    Schedule & Agenda
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.scheduleAgenda.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#10182A] border border-[#1E293B] flex items-center justify-between">
                        <span className="font-mono text-cyan-400 font-semibold">{item.time}</span>
                        <span className="text-[#F8FAFC] font-medium flex-1 px-4">{item.activity}</span>
                        {item.speaker && (
                          <span className="text-[10px] text-[#94A3B8] italic">{item.speaker}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participation Opportunities */}
              {selectedEvent.availableOpportunities.length > 0 && (
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] mb-2">
                    Contribution Opportunities for Employees
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedEvent.availableOpportunities.map((opp, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#10182A] border border-blue-500/20 flex items-center gap-2">
                        <HandHeart className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-[#F8FAFC] font-medium">{opp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#1E293B] bg-[#10182A] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Attendance Verification Trigger */}
                {selectedEvent.userAttended ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Attendance Recorded in Daily Log
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerifyAttendance(selectedEvent)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verify Event Attendance
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowContributeModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#151F35] hover:bg-[#19253F] border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <HandHeart className="w-4 h-4 text-cyan-400" />
                  Request to Contribute
                </button>

                {selectedEvent.isRegistered ? (
                  <span className="px-4 py-2 rounded-xl bg-blue-500/10 text-cyan-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-cyan-400" /> Registered Attendee
                  </span>
                ) : (
                  <button
                    onClick={() => handleRegister(selectedEvent)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-blue-glow transition-all"
                  >
                    Register for Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST TO CONTRIBUTE MODAL */}
      {showContributeModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#080D1B] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-[#F8FAFC]">Request to Contribute</h3>
              </div>
              <button 
                onClick={() => setShowContributeModal(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitContribution} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#10182A] border border-[#1E293B]">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">Selected Event</span>
                <span className="text-sm font-bold text-cyan-300">{selectedEvent.title}</span>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">
                  How would you like to contribute?
                </label>
                <select
                  value={contribCategory}
                  onChange={(e) => setContribCategory(e.target.value as ContributionCategory)}
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                >
                  <option value="Technical Session Coordination">Technical Session Coordination</option>
                  <option value="Workshop Assistance">Workshop Assistance</option>
                  <option value="Content Preparation">Content Preparation</option>
                  <option value="Design & Creative Work">Design & Creative Work</option>
                  <option value="Event Hosting & Emcee">Event Hosting & Emcee</option>
                  <option value="Technical Support & AV">Technical Support & AV</option>
                  <option value="Logistics & Management">Logistics & Management</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">
                  Relevant Skills & Experience (comma-separated):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TypeScript, Public Speaking, Slide Decks, Figma"
                  value={contribSkills}
                  onChange={(e) => setContribSkills(e.target.value)}
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">
                  Describe how you can help:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly explain what you would like to handle or prepare for this event..."
                  value={contribDescription}
                  onChange={(e) => setContribDescription(e.target.value)}
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">
                  Your Availability:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 hours prep beforehand + present for full event"
                  value={contribAvailability}
                  onChange={(e) => setContribAvailability(e.target.value)}
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold flex items-center gap-1.5 shadow-blue-glow transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
