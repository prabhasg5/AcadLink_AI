/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/src/store/MockAppStore";
import { AppLayout } from "@/src/components/AppLayout";
import { Login } from "@/src/pages/Login";
import { StudentDashboard } from "@/src/pages/student/Dashboard";
import { StudentWatchlist } from "@/src/pages/student/Watchlist";
import { FacultyDashboard } from "@/src/pages/faculty/Dashboard";
import { FacultyPostJob } from "@/src/pages/faculty/PostJob";
import { AdminDashboard } from "@/src/pages/admin/Dashboard";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/watchlist" element={<StudentWatchlist />} />
            
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/post" element={<FacultyPostJob />} />
            <Route path="/faculty/edit/:jobId" element={<FacultyPostJob />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/jobs" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
