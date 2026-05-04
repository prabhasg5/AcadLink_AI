import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/src/store/MockAppStore";
import { JobCard } from "@/src/components/JobCard";
import { Button } from "@/src/components/ui/Button";
import { PlusCircle, Search, Users, X, Download, PenBox } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import axios from "axios";
import * as XLSX from "xlsx";
import { useState } from "react";

export function FacultyDashboard() {
  const { user, opportunities } = useAppContext();

  // Show only jobs posted by this faculty
  const myJobs = opportunities.filter((op) => op.postedBy === user?.name);

  const [viewingApplicationsFor, setViewingApplicationsFor] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  const handleViewApplications = async (job: any) => {
    setViewingApplicationsFor(job);
    setIsLoadingApps(true);
    try {
      const res = await axios.get(`/api/faculty/jobs/${job.id}/applications`);
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      alert("Failed to fetch applications.");
    } finally {
      setIsLoadingApps(false);
    }
  };

  const exportToExcel = () => {
    if (!applications.length) return;
    
    const data = applications.map(app => {
      const baseData = {
        "Student Name": app.submittedData?.name || "Unknown",
        "Email": app.submittedData?.email || "Unknown",
        "Resume Link": app.submittedData?.resumeLink || "Not Provided",
        "Applied At": new Date(app.createdAt).toLocaleDateString()
      };
      const extra = app.submittedData?.extraFields || {};
      return { ...baseData, ...extra };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    
    XLSX.writeFile(workbook, `${viewingApplicationsFor?.companyName}_Applications.xlsx`);
  };

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
              <div key={job.id} className="space-y-2">
                <JobCard 
                  job={job}
                  showActions={false}
                />
                <div className="flex justify-end gap-2">
                  <Link to={`/faculty/edit/${job.id}`}>
                    <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
                      <PenBox className="w-4 h-4 mr-2 text-gray-500" /> Edit Job
                    </Button>
                  </Link>
                  {job.applicationType === "internal" && (
                    <Button size="sm" onClick={() => handleViewApplications(job)} variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
                      <Users className="w-4 h-4 mr-2 text-blue-600" /> View Applications
                    </Button>
                  )}
                </div>
              </div>
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

      {viewingApplicationsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Applications: {viewingApplicationsFor.companyName}</h3>
                <p className="text-sm text-gray-500">{applications.length} total applicants</p>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={exportToExcel} disabled={applications.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Download className="w-4 h-4 mr-2" /> Export Excel
                </Button>
                <button onClick={() => setViewingApplicationsFor(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {isLoadingApps ? (
                <div className="flex justify-center items-center py-12 text-gray-500">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">No applications received yet.</div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 whitespace-nowrap">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Applied At</th>
                        {viewingApplicationsFor.formFields?.map((f: any, i: number) => (
                          <th key={i} className="px-4 py-3 font-semibold">{f.fieldName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applications.map((app, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                          <td className="px-4 py-3 text-gray-900 font-medium">{app.submittedData?.name}</td>
                          <td className="px-4 py-3 text-gray-500">{app.submittedData?.email}</td>
                          <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                          {viewingApplicationsFor.formFields?.map((f: any, fi: number) => (
                            <td key={fi} className="px-4 py-3 text-gray-600">{app.submittedData?.extraFields?.[f.fieldName] || "-"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
