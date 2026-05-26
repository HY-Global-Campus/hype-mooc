import React from 'react';
import '../../Components/Exercise/exercises.css';
import '../pages.css';
import Header from '../../Components/Header';
import { courseCopy } from '../../../content/copy';
import ShareCanvasLink from '../../Components/ShareCanvasLink';

const EndPage: React.FC = () => {
  const userId = sessionStorage.getItem('id');

  return (
    <div className="page-with-header">
      <Header />
      <div className="exercise-container">
        <div className="exercise-content">
          <div className="exercise-single-column exercise-single-column--left">
            <div className="exercise-panel part-intro-panel end-page-panel">
              <h2 className="exercise-title end-page-title">Share your course canvas</h2>
              <p className="exercise-description end-page-subtitle">
                Share this view-only link
              </p>
              <div className="end-page-share">
                <ShareCanvasLink userId={userId} />
              </div>
              <div className="end-page-completion" role="status">
                <p className="end-page-completion-heading">
                  {courseCopy.endpage.congratulations}
                </p>
                <p className="end-page-completion-text">{courseCopy.endpage.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndPage;
