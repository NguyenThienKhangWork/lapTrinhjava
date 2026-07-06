import { useState } from "react";

export default function JobDetail() {
  const [proposal, setProposal] = useState({
    coverLetter: "",
    proposedBudget: "",
    proposedTimeline: "",
  });

  const job = {
    id: 1,
    title: "Build a landing page",
    description: "Create a responsive landing page for a small business.",
    budgetMin: 100,
    budgetMax: 300,
    skillsRequired: "React, CSS",
    type: "FIXED",
  };

  const handleChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Proposal submitted:", proposal);
    alert("Proposal submitted successfully!");
  };

  return (
    <div className="page-container">
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>Budget: ${job.budgetMin} - ${job.budgetMax}</p>
      <p>Skills: {job.skillsRequired}</p>
      <p>Type: {job.type}</p>

      <h2>Submit Proposal</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="coverLetter"
          placeholder="Cover letter"
          value={proposal.coverLetter}
          onChange={handleChange}
          required
        />
        <input
          name="proposedBudget"
          placeholder="Proposed budget"
          value={proposal.proposedBudget}
          onChange={handleChange}
        />
        <input
          name="proposedTimeline"
          placeholder="Proposed timeline"
          value={proposal.proposedTimeline}
          onChange={handleChange}
        />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
}