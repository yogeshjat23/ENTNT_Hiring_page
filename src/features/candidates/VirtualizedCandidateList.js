// src/components/VirtualizedCandidateList.js
import React, { useState, useMemo } from "react";
import { List, AutoSizer } from "react-virtualized";
import { Link } from "react-router-dom";
import "./VirtualizedCandidateList.css";


export default function VirtualizedCandidateList({ candidates = [] }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  // Filter logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchesStage = stageFilter
        ? c.stage.toLowerCase() === stageFilter.toLowerCase()
        : true;

      return matchesSearch && matchesStage;
    });
  }, [candidates, search, stageFilter]);

  // Row renderer
  const rowRenderer = ({ key, index, style }) => {
    const candidate = filteredCandidates[index];
    if (!candidate) return null;

    return (
      <div key={key} style={style} className="candidate-row">
        <Link to={`/candidates/${candidate.id}`} className="candidate-link">
          <div className="candidate-info">
            <strong>{candidate.name}</strong>
            <p>{candidate.email}</p>
          </div>
          <span className="candidate-stage">{candidate.stage}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="virtualized-list-wrapper" style={{ width: "100%" }}>
      {/* === Filter Section === */}
      <div className="filter-section" style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="">All Stages</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* === Candidate List === */}
      <div className="list-container" style={{ height: "600px", width: "100%" }}>
        {filteredCandidates.length === 0 ? (
          <p>No candidates found.</p>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={filteredCandidates.length}
                rowHeight={70}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
}
