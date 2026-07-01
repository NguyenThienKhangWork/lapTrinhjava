import { useState } from "react";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    skillsRequired: "",
    timeline: "",
    type: "FIXED",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post job data:", form);
    alert("Job posted successfully!");
  };

  return (
    <div className="page-container">
      <h1>Post a Job</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Job title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Job description" value={form.description} onChange={handleChange} required />
        <input name="budgetMin" placeholder="Minimum budget" value={form.budgetMin} onChange={handleChange} />
        <input name="budgetMax" placeholder="Maximum budget" value={form.budgetMax} onChange={handleChange} />
        <input name="skillsRequired" placeholder="Required skills" value={form.skillsRequired} onChange={handleChange} />
        <input name="timeline" placeholder="Timeline" value={form.timeline} onChange={handleChange} />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="FIXED">Fixed</option>
          <option value="HOURLY">Hourly</option>
        </select>

        <button type="submit">Submit Job</button>
      </form>
    </div>
  );
}