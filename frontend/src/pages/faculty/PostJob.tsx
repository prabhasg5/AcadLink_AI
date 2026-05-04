import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/src/store/MockAppStore";
import { Button } from "@/src/components/ui/Button";
import { Input, Textarea } from "@/src/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { X, Check } from "lucide-react";

const DEPARTMENTS = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "AIML",
  "BME"
];

export function FacultyPostJob() {
  const { user, addOpportunity } = useAppContext();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [type, setType] = useState<"Internship" | "Full-time">("Internship");
  const [packageOrStipend, setPackageOrStipend] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const toggleDept = (dept: string) => {
    setSelectedDepts(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !description || selectedDepts.length === 0 || skills.length === 0) {
      alert("Please fill all required fields, select at least 1 department, and add at least 1 skill.");
      return;
    }

    try {
      await addOpportunity({
        companyName,
        type,
        packageOrStipend,
        description,
        eligibleDepartments: selectedDepts,
        skillsRequired: skills,
        postedBy: user?.name || "Unknown Faculty",
      });
      navigate("/faculty");
    } catch (err) {
      alert("Failed to post opportunity. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Post New Opportunity</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new job or internship posting for students.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Company / Organization Name <span className="text-red-500">*</span></label>
                <Input
                  placeholder="e.g. Google, Research Lab"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Opportunity Type <span className="text-red-500">*</span></label>
                  <div className="flex bg-gray-100 p-1 rounded-md">
                    <button
                      type="button"
                      onClick={() => setType("Internship")}
                      className={`flex-1 text-sm py-1.5 rounded-sm transition-colors ${type === "Internship" ? "bg-white shadow-sm font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Internship
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("Full-time")}
                      className={`flex-1 text-sm py-1.5 rounded-sm transition-colors ${type === "Full-time" ? "bg-white shadow-sm font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Full-time
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Package / Stipend</label>
                  <Input
                    placeholder="e.g. $5000/mo or Unpaid"
                    value={packageOrStipend}
                    onChange={(e) => setPackageOrStipend(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Description <span className="text-red-500">*</span></label>
                <Textarea
                  placeholder="Describe the role, responsibilities, and learning outcomes..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 block mb-2 mt-2">Eligible Departments <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map(dept => {
                    const isSelected = selectedDepts.includes(dept);
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => toggleDept(dept)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 block mb-2 mt-2">Required Skills <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:bg-gray-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. React, Python (Press Enter)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddSkill}>Add</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 py-4 px-6 flex justify-end gap-3 rounded-b-xl">
            <Button type="button" variant="ghost" onClick={() => navigate("/faculty")}>Cancel</Button>
            <Button type="submit">Post Opportunity</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
