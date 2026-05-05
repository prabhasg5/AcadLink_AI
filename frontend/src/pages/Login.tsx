import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext, Role } from "@/src/store/MockAppStore";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Briefcase, UserIcon, GraduationCap, BriefcaseBusiness, Shield, Loader2 } from "lucide-react";

export function Login() {
  const { user, login, isAuthLoading } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${user.role?.toLowerCase()}`} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(selectedRole, { email, password });
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles: { id: Role; label: string; icon: any }[] = [
    { id: "Student", label: "Student", icon: GraduationCap },
    { id: "Faculty", label: "Faculty", icon: BriefcaseBusiness },
    { id: "Admin", label: "Admin", icon: Shield },
  ];

  // Define complete static class names so Tailwind doesn't purge them
  const themeClasses = {
    Student: {
      bgIcon: "bg-blue-600",
      shadowIcon: "shadow-blue-500/30",
      bgBlurTop: "bg-blue-400/10",
      bgBlurBot: "bg-blue-300/10",
      borderActive: "border-blue-600",
      bgActive: "bg-blue-50",
      textActive: "text-blue-700",
      ringActive: "ring-blue-600",
      iconActive: "text-blue-600",
      ringInput: "focus-visible:ring-blue-500",
      textLink: "text-blue-600",
      btnBg: "bg-blue-600",
      btnHover: "hover:bg-blue-700"
    },
    Faculty: {
      bgIcon: "bg-indigo-600",
      shadowIcon: "shadow-indigo-500/30",
      bgBlurTop: "bg-indigo-400/10",
      bgBlurBot: "bg-indigo-300/10",
      borderActive: "border-indigo-600",
      bgActive: "bg-indigo-50",
      textActive: "text-indigo-700",
      ringActive: "ring-indigo-600",
      iconActive: "text-indigo-600",
      ringInput: "focus-visible:ring-indigo-500",
      textLink: "text-indigo-600",
      btnBg: "bg-indigo-600",
      btnHover: "hover:bg-indigo-700"
    },
    Admin: {
      bgIcon: "bg-violet-600",
      shadowIcon: "shadow-violet-500/30",
      bgBlurTop: "bg-violet-400/10",
      bgBlurBot: "bg-violet-300/10",
      borderActive: "border-violet-600",
      bgActive: "bg-violet-50",
      textActive: "text-violet-700",
      ringActive: "ring-violet-600",
      iconActive: "text-violet-600",
      ringInput: "focus-visible:ring-violet-500",
      textLink: "text-violet-600",
      btnBg: "bg-violet-600",
      btnHover: "hover:bg-violet-700"
    }
  };

  const t = themeClasses[selectedRole];

  return (
    <div className="w-full h-screen flex bg-white overflow-hidden">
      {/* Left Column: Image Area */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden items-end p-12">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
            alt="University Campus" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-lg">
          <div className={`w-14 h-14 rounded-2xl ${t.bgIcon} flex items-center justify-center mb-6 shadow-xl ${t.shadowIcon} transition-colors duration-500`}>
             <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Elevate Your Academic Journey
          </h1>
          <p className="text-lg text-gray-300">
            Connecting brilliant students with exceptional opportunities. The unified platform for campus placements and career growth.
          </p>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden sm:block">
           <div className={`absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full ${t.bgBlurTop} blur-[100px] transition-colors duration-700`} />
           <div className={`absolute top-[60%] -left-[10%] w-[40%] h-[50%] rounded-full ${t.bgBlurBot} blur-[100px] transition-colors duration-700`} />
        </div>

        <div className="relative z-10 w-full max-w-[400px]">
          <div className="flex flex-col items-start mb-8">
            <div className={`w-12 h-12 rounded-xl ${t.bgIcon} flex lg:hidden items-center justify-center mb-4 shadow-lg ${t.shadowIcon} transition-colors duration-500`}>
               <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        isSelected 
                          ? `${t.borderActive} ${t.bgActive} ${t.textActive} ring-1 ${t.ringActive} ring-offset-1` 
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <r.icon className={`w-5 h-5 transition-colors duration-300 ${isSelected ? t.iconActive : "text-gray-400"}`} />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Email Address</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="name@university.edu" 
                    className={`pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors ${t.ringInput}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Password</label>
                  <a href="#" className={`text-xs ${t.textLink} hover:underline font-medium transition-colors`}>Forgot password?</a>
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={`h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors ${t.ringInput}`}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className={`w-full h-12 text-base font-medium shadow-md transition-all duration-300 text-white ${t.btnBg} ${t.btnHover}`}>
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing in...</>
              ) : (
                `Sign in as ${selectedRole}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
