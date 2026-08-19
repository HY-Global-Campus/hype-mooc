import React from 'react';
import Header from '../../Components/Header';
import ShareCanvasLink from '../../Components/ShareCanvasLink';
import { courseCopy } from '../../../content/copy';
import '../pages.css';
import '../../Components/Exercise/exercises.css';

const Part1Page: React.FC = () => {
  const userId = sessionStorage.getItem('id');

  return (
    <div className="page-with-header">
      <Header />
      <div className="exercise-container">
        <div className="exercise-content">
          <div className="exercise-single-column exercise-single-column--left">
            <div className="exercise-panel part-intro-panel">
              <h2 className="exercise-title part-intro-title">
                {courseCopy.part1.title}
              </h2>
              <p className="exercise-description part-intro-instruction">
                {courseCopy.part1.instruction}
              </p>
              <div className="part-intro-share">
                <ShareCanvasLink userId={userId} />
              </div>
              {courseCopy.part1.peerReviewCriteria?.length ? (
                <>
                  <h3 className="exercise-subtitle part-intro-subtitle">
                    Part 1 peer review criteria:
                  </h3>
                  <ul className="part-peer-review-list">
                    {courseCopy.part1.peerReviewCriteria.map((criterion, i) => (
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

export default Part1Page;
