import React, { useCallback } from 'react';
import { useExerciseContext } from './useExerciseContext';
import { ExerciseMeta } from '../../../content/exercises';
import { useCurrentExerciseMeta } from './useCurrentExerciseMeta';
import { CanvasExerciseId, getTextExerciseValue } from './exerciseDataHelpers';
import { Course } from '../../api/courseService';
import { getAnswerPlaceholder } from '../../../content/fieldCopy';
import WordLimitedTextarea from './WordLimitedTextarea';
import './exercises.css';

type TextExerciseProps = {
  exerciseMeta?: ExerciseMeta;
};

const TextExercise: React.FC<TextExerciseProps> = ({ exerciseMeta: metaOverride }) => {
  const { bookOne, onUpdateBookOne, readonly } = useExerciseContext();
  const meta = useCurrentExerciseMeta(metaOverride);
  const exerciseId = meta?.id as CanvasExerciseId | undefined;

  const value =
    exerciseId && bookOne ? getTextExerciseValue(bookOne, exerciseId) : '';

  const updateValue = useCallback(
    (next: string) => {
      if (!exerciseId) return;
      onUpdateBookOne((current: Course) => ({
        ...current,
        exercises: {
          ...current.exercises,
          [exerciseId]: { value: next },
        },
      }));
    },
    [onUpdateBookOne, exerciseId]
  );

  if (!meta) return null;

  const multiline = !!meta.props?.multiline;
  const compact = !!meta.props?.compact;
  const questionLabel = meta.props?.questionLabel;
  const wordLimit = meta.props?.wordLimit;
  // Only the multiline branch can cap and count words, so only it may promise a limit —
  // a single-line exercise configured with wordLimit must not advertise one it ignores.
  const placeholder = getAnswerPlaceholder(multiline ? wordLimit : undefined);

  if (readonly) {
    return (
      <div className="exercise-content">
        <div className="exercise-panel">
          <h2 className="exercise-title">{meta.title}</h2>
          {questionLabel && (
            <p className="exercise-description" style={{ marginBottom: '12px' }}>
              {questionLabel}
            </p>
          )}
          <div className={`readonly-text${value ? '' : ' readonly-text--empty'}`}>
            {value || 'No answer provided'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-content">
      <div className="exercise-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 className="exercise-title">{meta.title}</h2>
        {questionLabel && (
          <p className="exercise-description" style={{ marginBottom: '12px' }}>
            {questionLabel}
          </p>
        )}
        {multiline ? (
          <WordLimitedTextarea
            className={`exercise-textarea${compact ? ' exercise-textarea--compact' : ''}`}
            value={value}
            wordLimit={wordLimit}
            onValueChange={updateValue}
            placeholder={placeholder}
            rows={compact ? 5 : undefined}
            style={compact ? { flex: 'none' } : { flex: 1 }}
            wrapperClassName={compact ? undefined : 'exercise-answer-field--fill'}
          />
        ) : (
          <input
            className="exercise-input"
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default TextExercise;
