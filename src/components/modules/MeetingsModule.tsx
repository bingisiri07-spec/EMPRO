import React, { useState } from 'react';
import { 
  Video, 
  Clock, 
  MapPin, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { MeetingItem } from '../../types';
import { MOCK_MEETINGS } from '../../data/mockData';

export const MeetingsModule: React.FC = () => {
  const [meetings] = useState<MeetingItem[]>(MOCK_MEETINGS);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Corporate Schedules & Syncs
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Connected Workspace Calendar</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Meetings & Agendas</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Coordinate with engineering, review sprint objectives, and summarize meeting action items.
          </p>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div 
            key={meeting.id}
            className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                  {meeting.type}
                </span>
                <span className="text-xs font-mono text-cyan-400">{meeting.date}</span>
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">{meeting.title}</h3>
              <p className="text-xs text-[#94A3B8] flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-[#F8FAFC]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {meeting.time} ({meeting.duration})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {meeting.location}
                </span>
              </p>
              <p className="text-xs text-slate-400">
                Attendees: <span className="text-[#94A3B8]">{meeting.participants.join(', ')}</span>
              </p>
              {meeting.summary && (
                <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] text-xs space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Note Summary</span>
                  </div>
                  <p className="text-[#F8FAFC] italic">"{meeting.summary}"</p>
                  {meeting.actionItems && (
                    <div className="pt-1 space-y-0.5 text-[11px] text-[#94A3B8]">
                      {meeting.actionItems.map(item => (
                        <div key={item} className="flex items-center gap-1">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedMeeting(meeting)}
                className="py-2 px-3.5 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-medium text-cyan-300 border border-[#1E293B] transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes & Agendas</span>
              </button>

              {meeting.isOnline && meeting.meetingLink && (
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-blue-glow transition-all flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Video Call</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Notes Detail Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">{selectedMeeting.title}</h3>
            <p className="text-xs text-cyan-400 font-mono">{selectedMeeting.time} • {selectedMeeting.location}</p>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-[#F8FAFC]">Participants</h4>
              <p className="text-[#94A3B8]">{selectedMeeting.participants.join(', ')}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-[#F8FAFC]">Meeting Summary</h4>
              <p className="text-[#94A3B8] leading-relaxed">
                {selectedMeeting.summary || 'Summary generated by Professional Copilot following recording transcription.'}
              </p>
            </div>

            <button
              onClick={() => setSelectedMeeting(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#151F35] text-xs font-semibold text-[#F8FAFC] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
