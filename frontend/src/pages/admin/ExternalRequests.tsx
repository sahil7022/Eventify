import React from 'react';
import { Check, X, Globe, Building, Info, Link as LinkIcon } from 'lucide-react';
import { ExternalEventRequest } from '../../types';

interface ExternalRequestsProps {
  requests: ExternalEventRequest[];
  handleRequest: (id: string, action: 'approve' | 'reject') => void;
}

export const ExternalRequests = ({ requests, handleRequest }: ExternalRequestsProps) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border-brand-border">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="text-brand-accent" size={24} />
          External Event Requests
        </h3>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 italic">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-brand-accent/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white italic uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                      {request.eventName}
                    </h4>
                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic flex items-center gap-1 mt-1">
                      <Building size={10} /> {request.collegeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequest(request.id, 'approve')}
                      className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleRequest(request.id, 'reject')}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-6 line-clamp-3 italic">
                  {request.eventDetails}
                </p>

                <div className="flex items-center justify-between mt-auto">
                   {request.websiteLink && (
                     <a 
                       href={request.websiteLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest italic hover:underline"
                     >
                       <LinkIcon size={12} /> Visit Website
                     </a>
                   )}
                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">
                     Received: {new Date(request.timestamp).toLocaleDateString()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
