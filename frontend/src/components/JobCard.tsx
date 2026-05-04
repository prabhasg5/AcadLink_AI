import React, { useState } from "react";
import { Opportunity } from "@/src/store/MockAppStore";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Building2, DollarSign, Bookmark, BookmarkCheck, BarChart, Send, ExternalLink, Calendar, FileText, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

interface JobCardProps {
  job: Opportunity;
  isWatchlisted?: boolean;
  onToggleWatchlist?: () => void;
  onAnalyse?: () => void;
  onApply?: () => void;
  showActions?: boolean;
  hasApplied?: boolean;
}

export function JobCard({ job, isWatchlisted, onToggleWatchlist, onAnalyse, onApply, showActions = true, hasApplied = false }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
                  {job.applicationType === "external" && (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-amber-200 text-amber-700 bg-amber-50">External</Badge>
                  )}
                  {job.applicationType === "internal" && (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-blue-200 text-blue-700 bg-blue-50">Internal</Badge>
                  )}
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
                   {onApply && (
                     hasApplied ? (
                       <Button size="sm" disabled className="bg-emerald-50 text-emerald-700 border border-emerald-200 opacity-100 cursor-not-allowed">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Applied
                       </Button>
                     ) : (
                       <Button size="sm" onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white">
                          {job.applicationType === "external" ? <ExternalLink className="w-4 h-4 mr-1.5" /> : <Send className="w-4 h-4 mr-1.5" />}
                          Apply
                       </Button>
                     )
                   )}
                   {onToggleWatchlist && (
                      <Button variant="ghost" size="icon" onClick={onToggleWatchlist} className={isWatchlisted ? "text-blue-600" : "text-gray-400 hover:text-gray-900"}>
                        {isWatchlisted ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                      </Button>
                   )}
                 </div>
              )}
            </div>

            <div className="mt-4">
              <p className={`text-sm text-gray-600 ${!isExpanded && 'line-clamp-2'}`}>
                {job.description}
              </p>
              {job.description.length > 120 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-1"
                >
                  {isExpanded ? "See less" : "See more"}
                </button>
              )}
            </div>

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

            {/* Exam Details & Resources */}
            {(job.examDetails?.date || job.examDetails?.pattern || (job.resources && job.resources.length > 0)) && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-6">
                
                {job.examDetails && (job.examDetails.date || job.examDetails.pattern) && (
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Exam Details</h4>
                    <ul className="space-y-1">
                      {job.examDetails.date && <li className="text-sm text-gray-600"><span className="text-gray-500">Date:</span> {new Date(job.examDetails.date).toLocaleDateString()}</li>}
                      {job.examDetails.pattern && <li className="text-sm text-gray-600"><span className="text-gray-500">Pattern:</span> {job.examDetails.pattern}</li>}
                    </ul>
                  </div>
                )}

                {job.resources && job.resources.length > 0 && (
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gray-400" /> Resources</h4>
                    <ul className="space-y-1.5">
                      {job.resources.map((res, i) => (
                        <li key={i}>
                          <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-start gap-1">
                            <LinkIcon className="w-3 h-3 mt-1 shrink-0" /> <span className="underline-offset-2 hover:underline">{res.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
