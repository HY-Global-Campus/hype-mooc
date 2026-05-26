import React from 'react';
import Header from '../../Components/Header';
import { courseCopy } from '../../../content/copy';
import '../pages.css';
import '../../Components/Exercise/exercises.css';

const Part5Page: React.FC = () => {
  return (
    <div className="page-with-header">
      <Header />
      <div className="exercise-container">
        <div className="exercise-content">
          <div className="exercise-single-column exercise-single-column--left">
            <div className="exercise-panel part-intro-panel">
              <h2 className="exercise-title part-intro-title">{courseCopy.part5.title}</h2>
              <p className="exercise-description part-intro-instruction">
                {courseCopy.part5.instruction}
              </p>
              {courseCopy.part5.peerReviewCriteria?.length ? (
                <>
                  <h3 className="exercise-subtitle part-intro-subtitle">
                    Part 5 peer review criteria:
                  </h3>
                  <ul className="part-peer-review-list">
                    {courseCopy.part5.peerReviewCriteria.map((criterion, i) => (
                      <li key={i}>{criterion}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part5Page;
