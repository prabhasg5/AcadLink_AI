import React from "react";
import { useAppContext } from "@/src/store/MockAppStore";
import { JobCard } from "@/src/components/JobCard";
import { BookmarkIcon } from "lucide-react";

export function StudentWatchlist() {
  const { opportunities, watchlist, toggleWatchlist } = useAppContext();

  const savedJobs = opportunities.filter((op) => watchlist.includes(op.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Watchlist</h1>
        <p className="text-gray-500 text-sm mt-1">Opportunities you've saved for later</p>
      </div>

      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              isWatchlisted={true}
              onToggleWatchlist={() => toggleWatchlist(job.id)}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
           <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <BookmarkIcon className="w-8 h-8 text-blue-600" />
           </div>
           <h3 className="text-lg font-medium text-gray-900">Your watchlist is empty</h3>
           <p className="text-gray-500 mt-2 max-w-md mx-auto">
             Keep track of jobs you're interested in by saving them from the opportunity feed.
           </p>
        </div>
      )}
    </div>
  );
}
