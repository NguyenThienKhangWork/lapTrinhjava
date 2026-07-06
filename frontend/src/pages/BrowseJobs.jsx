import { useState } from "react";

const sampleJobs = [
  {
    id: 1,
    title: "Build a landing page",
    description: "Create a responsive landing page for a small business.",
    budgetMin: 100,
    budgetMax: 300,
    skillsRequired: "React, CSS",
    type: "FIXED",
  },
  {
    id: 2,
    title: "Fix backend API",
    description: "Debug Spring Boot REST API issues.",
    budgetMin: 10,
    budgetMax: 20,
    skillsRequired: "Java, Spring Boot",
    type: "HOURLY",
  },
];

export default function BrowseJobs() {
  const [keyword, setKeyword] = useState("");

  const filteredJobs = sampleJobs.filter((job) =>
    job.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Browse Jobs</h1>

      <input
        placeholder="Search jobs..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div>
        {filteredJobs.map((job) => (
          <div key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Budget: ${job.budgetMin} - ${job.budgetMax}</p>
            <p>Skills: {job.skillsRequired}</p>
            <p>Type: {job.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}