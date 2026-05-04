import React from "react";
import { useAppContext } from "@/src/store/MockAppStore";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Users, Briefcase, GraduationCap, Building2, Eye, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

export function AdminDashboard() {
  const { opportunities } = useAppContext();

  // Mock aggregate stats
  const totalStudents = 1240;
  const totalFaculty = 85;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card>
            <CardContent className="p-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-500">Total Students</p>
                 <h4 className="text-2xl font-bold tracking-tight text-gray-900">{totalStudents}</h4>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-500">Active Opportunities</p>
                 <h4 className="text-2xl font-bold tracking-tight text-gray-900">{opportunities.length}</h4>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-500">Registered Faculty</p>
                 <h4 className="text-2xl font-bold tracking-tight text-gray-900">{totalFaculty}</h4>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Table View */}
      <Card>
         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">All Opportunities</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                     <th className="px-6 py-3 font-medium">Company / Role</th>
                     <th className="px-6 py-3 font-medium">Type</th>
                     <th className="px-6 py-3 font-medium hide-on-mobile">Departments</th>
                     <th className="px-6 py-3 font-medium hide-on-mobile">Posted By</th>
                     <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {opportunities.map(op => (
                     <tr key={op.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 hidden sm:flex">
                                <Building2 className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">{op.companyName}</p>
                                 <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{op.description}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <Badge variant={op.type === 'Internship' ? 'secondary' : 'default'} className="font-normal">
                             {op.type}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 hide-on-mobile">
                           <div className="flex flex-wrap gap-1 max-w-[250px]">
                              {op.eligibleDepartments.slice(0, 2).map((d, i) => (
                                <span key={i} className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{d}</span>
                              ))}
                              {op.eligibleDepartments.length > 2 && (
                                <span className="text-xs text-gray-500">+{op.eligibleDepartments.length - 2}</span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 hide-on-mobile">
                           {op.postedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}
