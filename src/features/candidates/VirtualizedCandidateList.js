import React from 'react';
import { List } from 'react-window';
import { Link } from 'react-router-dom';

// Renders a single row in the list
const Row = ({ index, style, data }) => {
  const candidate = data[index];
  return (
    <div style={style} className="virtual-list-row">
      <Link to={`/candidates/${candidate.id}`}>
        <div className="candidate-info">
          <strong>{candidate.name}</strong>
          <span>{candidate.email}</span>
        </div>
        <div className="candidate-stage">{candidate.stage}</div>
      </Link>
    </div>
  );
};

export default function VirtualizedCandidateList({ candidates }) {
  return (
    <div className="virtual-list-container">
      <List
        height={600} // You can adjust this height
        itemCount={candidates.length}
        itemSize={60} // The height of each row in pixels
        width="100%"
        itemData={candidates} // Pass the candidates array to the Row component
      >
        {Row}
      </List>
    </div>
  );
}