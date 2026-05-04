import React from "react";
import { useAppContext } from "@/src/store/MockAppStore";
import { JobCard } from "@/src/components/JobCard";
import { BookmarkIcon, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";

export function StudentWatchlist() {
  const { user, opportunities, watchlist, toggleWatchlist, appliedJobs, addAppliedJob } = useAppContext();

  const savedJobs = opportunities.filter((op) => watchlist.includes(op.id));

  const [selectedJobForApply, setSelectedJobForApply] = useState<any>(null);
  const [applyFormData, setApplyFormData] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyClick = (job: any) => {
    if (job.applicationType === "external" && job.applicationLink) {
      window.open(job.applicationLink, "_blank");
    } else {
      setSelectedJobForApply(job);
      setApplyFormData({});
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply || !user) return;
    setIsApplying(true);
    try {
      await axios.post("/api/student/apply", {
        studentId: user._id,
        jobId: selectedJobForApply.id,
        formData: applyFormData
      });
      alert("Application submitted successfully!");
      addAppliedJob(selectedJobForApply.id);
      setSelectedJobForApply(null);
    } catch (err) {
      console.error("Failed to apply", err);
      alert("Failed to apply. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

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
              onApply={() => handleApplyClick(job)}
              hasApplied={appliedJobs.includes(job.id)}
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

      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
            <CardHeader className="border-b border-gray-100 pb-4 relative">
              <button
                onClick={() => setSelectedJobForApply(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <CardTitle>Apply for {selectedJobForApply.companyName}</CardTitle>
              <CardDescription>Please provide the required information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={submitApplication} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input value={user?.name || ""} disabled className="bg-gray-50 text-gray-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={user?.email || ""} disabled className="bg-gray-50 text-gray-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Roll Number</label>
                  <Input value={user?.rollNumber || ""} disabled className="bg-gray-50 text-gray-500" />
                </div>

                {selectedJobForApply.formFields?.map((field: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.fieldName} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.fieldType === 'textarea' ? (
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        required={field.required}
                        value={applyFormData[field.fieldName] || ""}
                        onChange={(e) => setApplyFormData({ ...applyFormData, [field.fieldName]: e.target.value })}
                      />
                    ) : (
                      <Input
                        type={field.fieldType === 'number' ? 'number' : 'text'}
                        required={field.required}
                        value={applyFormData[field.fieldName] || ""}
                        onChange={(e) => setApplyFormData({ ...applyFormData, [field.fieldName]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setSelectedJobForApply(null)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={isApplying}>
                    {isApplying ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
