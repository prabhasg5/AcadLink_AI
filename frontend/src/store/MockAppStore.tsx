import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

export type Role = "Student" | "Faculty" | "Admin" | null;

export interface Opportunity {
  _id: string;
  id: string;
  companyName: string;
  type: string;
  packageOrStipend: string;
  description: string;
  skillsRequired: string[];
  eligibleDepartments: string[];
  postedBy: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  rollNumber?: string;
  skills?: string[];
  projects?: string[];
  resumeUploaded?: boolean;
}

interface AppContextType {
  user: User | null;
  login: (role: Role, data: any) => Promise<void>;
  logout: () => void;
  opportunities: Opportunity[];
  fetchOpportunities: () => Promise<void>;
  addOpportunity: (op: any) => Promise<void>;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const login = async (role: Role, data: any) => {
    const endpoint = role === "Student" ? "/api/auth/student" : role === "Faculty" ? "/api/auth/faculty" : "/api/auth/admin";
    try {
      const res = await axios.post(endpoint, data);
      setUser({ ...res.data, role });
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setWatchlist([]);
  };

  const fetchOpportunities = async () => {
    if (user?.role === "Student") {
      try {
        const res = await axios.get(`/api/student/jobs/${user._id}`);
        const mapped = res.data.map((j: any) => ({
          ...j,
          id: j._id,
          companyName: j.company,
          eligibleDepartments: j.departmentsEligible,
        }));
        setOpportunities(mapped);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    } else if (user?.role === "Faculty") {
      try {
        const res = await axios.get(`/api/faculty/jobs/${user.name}`);
        const mapped = res.data.map((j: any) => ({
          ...j,
          id: j._id,
          companyName: j.company,
          eligibleDepartments: j.departmentsEligible,
        }));
        setOpportunities(mapped);
      } catch (err) {
        console.error("Failed to fetch faculty jobs", err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchOpportunities();
    }
  }, [user]);

  const addOpportunity = async (op: any) => {
    try {
      const payload = {
        ...op,
        company: op.companyName,
        departmentsEligible: op.eligibleDepartments,
      };
      const res = await axios.post("/api/faculty/add-job", payload);
      const newJob = {
        ...res.data,
        id: res.data._id,
        companyName: res.data.company,
        eligibleDepartments: res.data.departmentsEligible,
      };
      setOpportunities((prev) => [newJob, ...prev]);
    } catch (err) {
      console.error("Failed to add job", err);
      throw err;
    }
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        opportunities,
        fetchOpportunities,
        addOpportunity,
        watchlist,
        toggleWatchlist,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
