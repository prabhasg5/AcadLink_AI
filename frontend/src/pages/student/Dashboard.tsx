import React, { useState, useRef } from "react";
import axios from "axios";
import { useAppContext, Opportunity } from "@/src/store/MockAppStore";
import { JobCard } from "@/src/components/JobCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Upload, FileText, CheckCircle2, ChevronRight, Target, AlertCircle } from "lucide-react";

export function StudentDashboard() {
  const { user, opportunities, watchlist, toggleWatchlist, setUser } = useAppContext();
  const [selectedJobForAnalysis, setSelectedJobForAnalysis] = useState<Opportunity | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("studentId", user._id);

    try {
      const res = await axios.post("/api/student/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser({ ...user, ...res.data });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyse = async (job: Opportunity) => {
    setSelectedJobForAnalysis(job);
    setAnalysisReport(null);
    if (!user) return;

    setIsAnalysing(true);
    try {
      const res = await axios.post("/api/analyse", {
        studentId: user._id,
        jobId: job.id
      });
      setAnalysisReport(res.data);
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Failed to analyse fit. Please try again.");
    } finally {
      setIsAnalysing(false);
    }
  };

  // Filter jobs based on student's department
  const recommendedJobs = opportunities.filter((op) =>
    op.eligibleDepartments.includes(user?.department || "")
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Left Column: Profile & Analysis */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
        {/* Profile Card */}
        <Card className="border-gray-200 shadow-sm overflow-hidden relative">
          <div className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardContent className="pt-0 relative px-6 pb-6">
            <div className="w-16 h-16 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center -mt-8 mb-3">
              <div className="w-full h-full bg-blue-100 text-blue-700 font-bold text-xl rounded-lg flex items-center justify-center">
                {user?.name.charAt(0)}
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <div className="text-sm text-gray-500 mt-1 font-medium space-y-1">
              <p>{user?.department}</p>
              <p>Roll: {user?.rollNumber}</p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              {user?.resumeUploaded ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-md">
                    <CheckCircle2 className="w-4 h-4" />
                    Resume Parsed
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Top Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user?.skills?.map((s) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                    {user?.projects && user.projects.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Projects</p>
                        <div className="flex flex-col gap-2 text-sm text-gray-700">
                          {user.projects.map((p, i) => (
                            <div key={i} className="flex items-start gap-2 bg-gray-50 p-2 rounded-md border border-gray-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-5 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No Resume Found</h3>
                  <p className="text-xs text-gray-500 mb-4">Upload to get personalized job matches</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                  >
                    {isUploading ? "Analysing..." : <><Upload className="w-4 h-4 mr-2" /> Upload PDF</>}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Right Column: Feed */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Recommended for You</h1>
            <p className="text-gray-500 text-sm mt-1">Based on your {user?.department} department</p>
          </div>
          <div className="flex gap-2 text-sm font-medium text-gray-500 bg-gray-100 p-1 rounded-lg">
            <button className="px-3 py-1.5 bg-white text-gray-900 rounded-md shadow-sm">All Matches</button>
            <button className="px-3 py-1.5 hover:text-gray-900">Internships</button>
          </div>
        </div>

        {recommendedJobs.length > 0 ? (
          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="space-y-4">
                <JobCard
                  job={job}
                  isWatchlisted={watchlist.includes(job.id)}
                  onToggleWatchlist={() => toggleWatchlist(job.id)}
                  onAnalyse={() => handleAnalyse(job)}
                />
                
                {selectedJobForAnalysis?.id === job.id && (
                  <div className="pl-4 md:pl-8 border-l-2 border-indigo-200 ml-4">
                    <Card className="border-indigo-100 shadow-md shadow-indigo-100/50 bg-white ring-1 ring-indigo-50">
                      <CardHeader className="p-5 pb-3 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-indigo-600" />
                          <CardTitle className="text-base text-gray-900">Fit Analysis</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 space-y-5">
                        {isAnalysing ? (
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                            <p className="text-sm text-gray-500 font-medium">AI is analysing your fit...</p>
                          </div>
                        ) : analysisReport ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Match Score</span>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">{analysisReport.matchScore}%</span>
                              </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${analysisReport.matchScore >= 70 ? 'bg-emerald-500' : analysisReport.matchScore >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(100, Math.max(0, analysisReport.matchScore))}%` }}
                              />
                            </div>

                            {!user?.resumeUploaded ? (
                              <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-md flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>Upload your resume to see your real skill match score.</p>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-3">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Missing Skills</p>
                                  {analysisReport.missingSkills && analysisReport.missingSkills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {analysisReport.missingSkills.map((skill: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-red-600 bg-red-50 border-red-100">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-emerald-600 font-medium">You have all required skills!</p>
                                  )}
                                </div>

                                {analysisReport.suggestions && analysisReport.suggestions.length > 0 && (
                                  <div className="space-y-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Learning Suggestions</p>
                                    <ul className="space-y-2">
                                      {analysisReport.suggestions.map((suggestion: string, i: number) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                          <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                          <span>{suggestion}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <BriefcaseIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No opportunities found</h3>
            <p className="text-gray-500 mt-1">Try checking back later for new postings.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BriefcaseIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
