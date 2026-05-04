import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/src/store/MockAppStore";
import { Button } from "@/src/components/ui/Button";
import { Input, Textarea } from "@/src/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { X, Check, Plus, Trash2 } from "lucide-react";

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
  const { user, addOpportunity, updateOpportunity, opportunities } = useAppContext();
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [companyName, setCompanyName] = useState("");
  const [type, setType] = useState<"Internship" | "Full-time">("Internship");
  const [packageOrStipend, setPackageOrStipend] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [applicationType, setApplicationType] = useState<"internal" | "external">("internal");
  const [applicationLink, setApplicationLink] = useState("");
  const [formFields, setFormFields] = useState<{ fieldName: string; fieldType: string; required: boolean }[]>([]);

  const [examDate, setExamDate] = useState("");
  const [examPattern, setExamPattern] = useState("");
  
  const [resources, setResources] = useState<{title: string, link: string}[]>([]);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const handleAddResource = () => {
    if (resourceTitle && resourceLink) {
      setResources([...resources, { title: resourceTitle, link: resourceLink }]);
      setResourceTitle("");
      setResourceLink("");
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addFormField = () => {
    setFormFields([...formFields, { fieldName: "", fieldType: "text", required: false }]);
  };

  useEffect(() => {
    if (jobId && opportunities.length > 0) {
      const existingJob = opportunities.find(j => j.id === jobId);
      if (existingJob) {
        setCompanyName(existingJob.companyName);
        setType(existingJob.type as "Internship" | "Full-time");
        setPackageOrStipend(existingJob.packageOrStipend || "");
        setDescription(existingJob.description || "");
        setSelectedDepts(existingJob.eligibleDepartments || []);
        setSkills(existingJob.skillsRequired || []);
        
        if (existingJob.applicationType) setApplicationType(existingJob.applicationType);
        if (existingJob.applicationLink) setApplicationLink(existingJob.applicationLink);
        if (existingJob.formFields) setFormFields(existingJob.formFields);
        
        if (existingJob.examDetails) {
          if (existingJob.examDetails.date) setExamDate(existingJob.examDetails.date.split('T')[0]);
          if (existingJob.examDetails.pattern) setExamPattern(existingJob.examDetails.pattern);
        }
        
        if (existingJob.resources) {
          setResources(existingJob.resources);
        }
      }
    }
  }, [jobId, opportunities]);

  const updateFormField = (index: number, key: keyof typeof formFields[0], value: any) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormFields(newFields);
  };

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

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
      const jobPayload = {
        companyName,
        type,
        packageOrStipend,
        description,
        eligibleDepartments: selectedDepts,
        skillsRequired: skills,
        postedBy: user?.name || "Unknown Faculty",
        applicationType,
        applicationLink: applicationType === "external" ? applicationLink : undefined,
        formFields: applicationType === "internal" ? formFields : undefined,
        examDetails: (examDate || examPattern) ? { date: examDate || undefined, pattern: examPattern || undefined } : undefined,
        resources: resources.length > 0 ? resources : undefined,
      };
      
      if (jobId) {
        await updateOpportunity(jobId, jobPayload);
      } else {
        await addOpportunity(jobPayload);
      }
      
      navigate("/faculty");
    } catch (err) {
      alert(`Failed to ${jobId ? "update" : "post"} opportunity. Please try again.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{jobId ? "Edit Opportunity" : "Post New Opportunity"}</h1>
        <p className="text-gray-500 text-sm mt-1">{jobId ? "Update existing job details." : "Create a new job or internship posting for students."}</p>
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
                <label className="text-sm font-medium text-gray-700 block mb-2 mt-2">Application Type</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={applicationType === "internal"}
                      onChange={() => setApplicationType("internal")}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    Internal Platform (Custom Form)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={applicationType === "external"}
                      onChange={() => setApplicationType("external")}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    External Link
                  </label>
                </div>

                {applicationType === "external" && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Application Link <span className="text-red-500">*</span></label>
                    <Input
                      type="url"
                      placeholder="https://company.com/careers"
                      value={applicationLink}
                      onChange={(e) => setApplicationLink(e.target.value)}
                      required={applicationType === "external"}
                    />
                  </div>
                )}

                {applicationType === "internal" && (
                  <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Custom Questions (Optional)</h4>
                        <p className="text-xs text-gray-500">Add questions like CGPA, Location Preferences, Backlogs, etc.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addFormField} className="h-8">
                        <Plus className="w-4 h-4 mr-1" /> Add Question
                      </Button>
                    </div>

                    {formFields.length > 0 && (
                      <div className="space-y-3 mt-3">
                        {formFields.map((field, index) => (
                          <div key={index} className="flex gap-3 items-start bg-white p-3 border border-gray-200 rounded-md shadow-sm">
                            <div className="flex-1">
                              <Input
                                placeholder="Question (e.g. Current CGPA)"
                                value={field.fieldName}
                                onChange={(e) => updateFormField(index, "fieldName", e.target.value)}
                                required
                                className="h-9"
                              />
                            </div>
                            <div className="w-32">
                              <select
                                value={field.fieldType}
                                onChange={(e) => updateFormField(index, "fieldType", e.target.value)}
                                className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="textarea">Long Text</option>
                              </select>
                            </div>
                            <div className="flex items-center h-9">
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateFormField(index, "required", e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Req.
                              </label>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFormField(index)} className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 block mb-2 mt-2">Exam Details (Optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Exam Date</label>
                    <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Exam Pattern</label>
                    <Input placeholder="e.g. 30 Aptitude, 2 Coding" value={examPattern} onChange={(e) => setExamPattern(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 block mb-2 mt-2">Study Materials & Resources (Optional)</label>
                <div className="flex gap-2 mb-3">
                  <Input placeholder="Title (e.g. Prep Guide PDF)" value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} className="flex-1" />
                  <Input placeholder="URL Link" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} className="flex-1" />
                  <Button type="button" variant="outline" onClick={handleAddResource}>Add</Button>
                </div>
                {resources.length > 0 && (
                  <div className="space-y-2">
                    {resources.map((res, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                        <div className="text-sm"><span className="font-medium text-gray-900">{res.title}</span> <span className="text-gray-500 text-xs">({res.link})</span></div>
                        <button type="button" onClick={() => removeResource(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
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
            <Button type="submit">{jobId ? "Update Opportunity" : "Post Opportunity"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
