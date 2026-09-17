import React from 'react';
import Header from '../../Components/Header';
import PartIntro from '../../Components/PartIntro';
import { courseCopy } from '../../../content/copy';
import '../pages.css';
import '../../Components/Exercise/exercises.css';

const Part2Page: React.FC = () => (
  <div className="page-with-header">
    <Header />
    <div className="exercise-container">
      <div className="exercise-content">
        <div className="exercise-single-column exercise-single-column--left">
          <PartIntro part={courseCopy.part2} partNumber={2} />
        </div>
      </div>
    </div>
  </div>
);

export default Part2Page;
