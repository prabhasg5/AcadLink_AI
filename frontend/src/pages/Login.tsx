import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext, Role } from "@/src/store/MockAppStore";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Briefcase, UserIcon, GraduationCap, BriefcaseBusiness, Shield } from "lucide-react";

export function Login() {
  const { user, login } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Navigate to={`/${user.role?.toLowerCase()}`} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(selectedRole, { email, password });
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  const roles: { id: Role; label: string; icon: any }[] = [
    { id: "Student", label: "Student", icon: GraduationCap },
    { id: "Faculty", label: "Faculty", icon: BriefcaseBusiness },
    { id: "Admin", label: "Admin", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-3xl" />
         <div className="absolute top-[60%] right-[0%] w-[40%] h-[50%] rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
             <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AcadLink AI</h1>
          <p className="text-gray-500 mt-2">Your AI-powered academic job portal</p>
        </div>

        <Card className="border-gray-200">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-4">
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Enter your details and select your role to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50 text-blue-700" 
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <r.icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                      {r.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="name@university.edu" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-11 text-base">
                Sign in as {selectedRole}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
