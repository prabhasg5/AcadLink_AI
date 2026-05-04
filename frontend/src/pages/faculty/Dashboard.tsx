import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/src/store/MockAppStore";
import { JobCard } from "@/src/components/JobCard";
import { Button } from "@/src/components/ui/Button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/src/components/ui/Input";

export function FacultyDashboard() {
  const { user, opportunities } = useAppContext();

  // Show only jobs posted by this faculty
  const myJobs = opportunities.filter((op) => op.postedBy === user?.name);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Posted Opportunities</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track jobs you have posted for students</p>
        </div>
        <Link to="/faculty/post">
          <Button className="w-full sm:w-auto">
             <PlusCircle className="w-4 h-4 mr-2" />
             Post New Job
          </Button>
        </Link>
      </div>

      {myJobs.length > 0 ? (
        <>
          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="text" placeholder="Search my postings..." className="pl-9" />
          </div>
          
          <div className="space-y-4">
            {myJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                showActions={false} // Don't need watchlist/analyse here
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 mt-8">
           <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
             <PlusCircle className="w-8 h-8 text-gray-400" />
           </div>
           <h3 className="text-lg font-medium text-gray-900">No opportunities posted yet</h3>
           <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
             Share internships or full-time roles with students to help them build their careers.
           </p>
           <Link to="/faculty/post">
             <Button variant="outline">Create your first post</Button>
           </Link>
        </div>
      )}
    </div>
  );
}
