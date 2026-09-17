import React from 'react';
import ShareCanvasLink from '../ShareCanvasLink';
import { PartCopy } from '../../../content/copy';
import '../Exercise/exercises.css';

type PartIntroProps = {
  part: PartCopy;
  /** The N in "Part N peer review criteria:". The title carries a subtitle, so it cannot supply it. */
  partNumber: number;
};

/** Landing page body shared by Parts 1-5: title, instructions, share link and peer review criteria. */
const PartIntro: React.FC<PartIntroProps> = ({ part, partNumber }) => {
  const userId = sessionStorage.getItem('id');

  return (
    <div className="exercise-panel part-intro-panel">
      <h2 className="exercise-title part-intro-title">{part.title}</h2>
      <p className="exercise-description part-intro-instruction">
        {part.intro} <strong>{part.introEmphasis}</strong>
      </p>
      <p className="exercise-description part-intro-instruction">
        <strong>Instructions:</strong>
      </p>
      <ol className="part-instruction-list">
        {part.instructions.map((step, index) => (
          <li key={index}>
            {typeof step === 'string' ? (
              step
            ) : (
              <>
                {step.intro}
                <a href={step.linkHref} target="_blank" rel="noopener noreferrer">
                  {step.linkLabel}
                </a>
                {step.outro}
              </>
            )}
          </li>
        ))}
      </ol>
      <div className="part-intro-share">
        <ShareCanvasLink userId={userId} />
      </div>
      {part.peerReviewCriteria.length ? (
        <>
          <h3 className="exercise-subtitle part-intro-subtitle">
            Part {partNumber} peer review criteria:
          </h3>
          <ul className="part-peer-review-list">
            {part.peerReviewCriteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};

export default PartIntro;
