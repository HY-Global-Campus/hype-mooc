import React from 'react';
import Header from '../../Components/Header';
import PartIntro from '../../Components/PartIntro';
import { courseCopy } from '../../../content/copy';
import '../pages.css';
import '../../Components/Exercise/exercises.css';

const Part3Page: React.FC = () => (
  <div className="page-with-header">
    <Header />
    <div className="exercise-container">
      <div className="exercise-content">
        <div className="exercise-single-column exercise-single-column--left">
          <PartIntro part={courseCopy.part3} partNumber={3} />
        </div>
      </div>
    </div>
  </div>
);

export default Part3Page;
