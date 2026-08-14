import React, { useCallback } from 'react';
import { useExerciseContext } from './useExerciseContext';
import { ExerciseMeta } from '../../../content/exercises';
import { useCurrentExerciseMeta } from './useCurrentExerciseMeta';
import {
  getAnswerPlaceholder,
  getFieldDescription,
  getFieldDisplayLabel,
} from '../../../content/fieldCopy';
import ChatBot from '../ChatBot';
import { CanvasExerciseId, getTwoColumnFieldMap } from './exerciseDataHelpers';
import { Course } from '../../api/courseService';
import WordLimitedTextarea from './WordLimitedTextarea';

type LearningObjectivesExerciseProps = {
  exerciseMeta?: ExerciseMeta;
};

const LearningObjectivesExercise: React.FC<LearningObjectivesExerciseProps> = ({
  exerciseMeta: metaOverride,
}) => {
  const { bookOne, onUpdateBookOne, readonly } = useExerciseContext();
  const meta = useCurrentExerciseMeta(metaOverride);

  const exerciseId = meta?.id as CanvasExerciseId | undefined;

  const getFieldValue = useCallback(
    (fieldLabel: string) => {
      if (!bookOne || !exerciseId) return '';
      return getTwoColumnFieldMap(bookOne, exerciseId)[fieldLabel] ?? '';
    },
    [bookOne, exerciseId]
  );

  const updateFieldValue = useCallback(
    (fieldLabel: string, value: string) => {
      if (!onUpdateBookOne || !exerciseId) return;

      onUpdateBookOne((currentBookOne: Course) => {
        const currentData = getTwoColumnFieldMap(currentBookOne, exerciseId);
        return {
          ...currentBookOne,
          exercises: {
            ...currentBookOne.exercises,
            [exerciseId]: {
              ...currentData,
              [fieldLabel]: value,
            },
          },
        };
      });
    },
    [onUpdateBookOne, exerciseId]
  );

  if (!meta?.props?.leftColumn || !meta?.props?.rightColumn) {
    return <div>Invalid exercise configuration</div>;
  }

  const { leftColumn, rightColumn } = meta.props;

  return (
    <div className="exercise-content learning-objectives-page">
      {readonly && meta.title && (
        <h2 className="exercise-title" style={{ marginBottom: '24px' }}>
          {meta.title}
        </h2>
      )}
      <div className="exercise-two-column">
        <div className="exercise-column">
          <h2 className="exercise-title">{leftColumn.title}</h2>
          {leftColumn.fields.map((field, index) => {
            const description = getFieldDescription(meta.id, field.label);
            const displayLabel = getFieldDisplayLabel(meta.id, field.label);
            const placeholder = getAnswerPlaceholder(field.wordLimit);
            const value = getFieldValue(field.label);

            if (readonly) {
              return (
                <div key={index} style={{ marginBottom: 'clamp(16px, 2vh, 28px)' }}>
                  <label
                    style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      fontFamily: "'Gotham Narrow', Arial, sans-serif",
                      fontSize: '16px',
                      color: '#000',
                    }}
                  >
                    {displayLabel}
                  </label>
                  {description && (
                    <p
                      className="exercise-description"
                      style={{ marginBottom: '12px', lineHeight: '1.5', fontSize: '16px' }}
                    >
                      {description}
                    </p>
                  )}
                  <div className={`readonly-text${value ? '' : ' readonly-text--empty'}`}>
                    {value || 'No answer provided'}
                  </div>
                </div>
              );
            }

            return (
              <div key={index} style={{ marginBottom: 'clamp(16px, 2vh, 28px)' }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    fontFamily: "'Gotham Narrow', Arial, sans-serif",
                    fontSize: '16px',
                    color: '#000',
                  }}
                >
                  {displayLabel}
                </label>
                <p
                  className="exercise-description"
                  style={{
                    marginBottom: '12px',
                    lineHeight: '1.5',
                    fontSize: '16px',
                    color: '#000',
                  }}
                >
                  {description}
                </p>
                <WordLimitedTextarea
                  className="exercise-textarea"
                  value={value}
                  wordLimit={field.wordLimit}
                  onValueChange={(next) => updateFieldValue(field.label, next)}
                  placeholder={placeholder}
                  required={field.required}
                  rows={6}
                  style={{
                    width: '100%',
                    border: '1px solid #000',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontFamily: "'Gotham Narrow', Arial, sans-serif",
                    background: 'white',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: 'clamp(110px, 14vh, 180px)',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="exercise-column">
          <h2 className="exercise-title learning-objectives-chat-title">{rightColumn.title}</h2>
          {readonly ? (
            <div className="learning-objectives-chat-shell learning-objectives-chat-shell--readonly">
              <p className="learning-objectives-chat-readonly-note">
                Chat conversations are not included in the shared view.
              </p>
            </div>
          ) : (
            <div className="learning-objectives-chat-shell">
              <div className="learning-objectives-chat-label">Conversation with Chatbot</div>
              <div className="learning-objectives-chat-body">
                <ChatBot />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningObjectivesExercise;
