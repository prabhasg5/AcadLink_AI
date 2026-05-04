import React from "react";
import { Opportunity } from "@/src/store/MockAppStore";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Building2, DollarSign, Bookmark, BookmarkCheck, BarChart } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

interface JobCardProps {
  job: Opportunity;
  isWatchlisted?: boolean;
  onToggleWatchlist?: () => void;
  onAnalyse?: () => void;
  showActions?: boolean;
}

export function JobCard({ job, isWatchlisted, onToggleWatchlist, onAnalyse, showActions = true }: JobCardProps) {
  return (
    <Card className="hover:border-blue-200 transition-colors duration-200 overflow-hidden group">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Logo Placeholder */}
          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {job.companyName}
                </h3>
                <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                    {job.packageOrStipend}
                  </span>
                  <span className="text-gray-400 text-xs">
                    Posted by {job.postedBy}
                  </span>
                </div>
              </div>

              {showActions && (
                 <div className="flex items-center gap-2 shrink-0">
                   {onAnalyse && (
                      <Button variant="outline" size="sm" onClick={onAnalyse} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        <BarChart className="w-4 h-4 mr-1.5" />
                        Analyse Fit
                      </Button>
                   )}
                   {onToggleWatchlist && (
                      <Button variant="ghost" size="icon" onClick={onToggleWatchlist} className={isWatchlisted ? "text-blue-600" : "text-gray-400 hover:text-gray-900"}>
                        {isWatchlisted ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                      </Button>
                   )}
                 </div>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-gray-100 hover:bg-gray-200 font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {job.eligibleDepartments && job.eligibleDepartments.length > 0 && (
                <Badge variant="outline" className="text-xs text-gray-500 font-normal border-gray-200">
                   {job.eligibleDepartments.join(", ")} Eligible
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple internal icon for this file since Briefcase was imported in AppLayout
function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
