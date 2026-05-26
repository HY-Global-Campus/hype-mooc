import React from 'react';
import Header from '../../Components/Header';
import { courseCopy } from '../../../content/copy';
import '../pages.css';

const AssignmentPage: React.FC = () => {
  const { leftColumn, rightColumn } = courseCopy.assignment;

  return (
    <div className="page-with-header assignment-page">
      <Header />
      <div className="exercise-container">
        <div className="exercise-content assignment-page-content">
          <div className="exercise-two-column">
            <div className="exercise-column">
              <h2 className="exercise-title">{leftColumn.title}</h2>
              <p className="exercise-description">
                {leftColumn.intro}
                <a
                  href={leftColumn.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {leftColumn.linkLabel}
                </a>
                {leftColumn.outro}
              </p>
            </div>
            <div className="exercise-column">
              <h2 className="exercise-title">{rightColumn.title}</h2>
              {rightColumn.content.map((paragraph, index) => (
                <p key={index} className="exercise-description">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
