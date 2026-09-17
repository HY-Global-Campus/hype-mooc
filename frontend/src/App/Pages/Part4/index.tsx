import React from 'react';
import Header from '../../Components/Header';
import PartIntro from '../../Components/PartIntro';
import { courseCopy } from '../../../content/copy';
import '../pages.css';
import '../../Components/Exercise/exercises.css';

const Part4Page: React.FC = () => (
  <div className="page-with-header">
    <Header />
    <div className="exercise-container">
      <div className="exercise-content">
        <div className="exercise-single-column exercise-single-column--left">
          <PartIntro part={courseCopy.part4} partNumber={4} />
        </div>
      </div>
    </div>
  </div>
);

export default Part4Page;
