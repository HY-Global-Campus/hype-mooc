import React, { useCallback, useRef } from 'react';
import { useExerciseContext } from './ExerciseContext';
import { exercisesMeta } from '../../../content/exercises';
import { useLocation } from 'react-router-dom';

const TwoColumnExercise: React.FC = () => {
  const { bookOne, onUpdateBookOne, readonly } = useExerciseContext();
  const location = useLocation();
  const meta = exercisesMeta.find(e => e.route === location.pathname);

  // Add refs for textareas
  const leftTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const rightTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  if (!meta) return null;

  const getFieldValue = useCallback((fieldLabel: string) => {
    if (!bookOne || !meta?.id) return '';
    const exerciseData = (bookOne as any).exercises?.[meta.id];
    return exerciseData?.[fieldLabel] || '';
  }, [bookOne, meta?.id]);

  const updateFieldValue = useCallback((fieldLabel: string, value: string) => {
    if (!onUpdateBookOne || !meta?.id) return;
    
    // Use a function to get the current state instead of relying on stale closure
    onUpdateBookOne((currentBookOne: any) => {
      if (!currentBookOne) return currentBookOne;
      
      const currentData = currentBookOne.exercises?.[meta.id] || {};
      const updatedData = {
        ...currentData,
        [fieldLabel]: value
      };

      return {
        ...currentBookOne,
        exercises: {
          ...currentBookOne.exercises,
          [meta.id]: updatedData
        }
      };
    });
  }, [onUpdateBookOne, meta?.id]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    isLeft: boolean,
    index: number
  ) => {
    // When user is at end of left textarea and presses right arrow
    if (
      isLeft &&
      e.key === 'ArrowRight' &&
      e.currentTarget.selectionStart === e.currentTarget.value.length
    ) {
      e.preventDefault();
      rightTextareaRefs.current[index]?.focus();
    }
    // When user is at start of right textarea and presses left arrow
    else if (!isLeft && e.key === 'ArrowLeft' && 
             e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      leftTextareaRefs.current[index]?.focus();
    }
  };

  if (!meta?.props?.leftColumn || !meta?.props?.rightColumn) {
    return <div>Invalid exercise configuration</div>;
  }

  const { leftColumn, rightColumn } = meta.props;

  const getTextareaMinHeight = (placeholder: string) =>
    placeholder.includes('200')
      ? 'clamp(140px, 18vh, 240px)'
      : 'clamp(96px, 12vh, 160px)';

  return (
    <div className="exercise-content">
      <div className="exercise-two-column">
        <div className="exercise-column">
          <h2 className="exercise-title">{leftColumn.title}</h2>
          {leftColumn.description && (
            <p className="exercise-description" style={{
              marginBottom: '24px',
              lineHeight: '1.5',
              fontSize: '16px',
              color: '#000'
            }}>
              {leftColumn.description}
            </p>
          )}
          {leftColumn.fields.map((field, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: 'clamp(16px, 2vh, 28px)' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                fontFamily: "'Gotham Narrow', Arial, sans-serif",
                fontSize: '16px',
                color: '#000'
              }}>
                {field.label}:
              </label>
              <textarea
                ref={(el) => leftTextareaRefs.current[index] = el}
                className="exercise-textarea"
                value={getFieldValue(field.label)}
                onChange={(e) => updateFieldValue(field.label, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, true, index)}
                disabled={readonly}
                placeholder={field.placeholder}
                required={field.required}
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
                  minHeight: getTextareaMinHeight(field.placeholder)
                }}
              />
            </div>
          ))}
        </div>
        <div className="exercise-column">
          {rightColumn.title && (
            <h2 className="exercise-title">{rightColumn.title}</h2>
          )}
          {rightColumn.description && (
            <p className="exercise-description" style={{
              marginBottom: '24px',
              lineHeight: '1.5',
              fontSize: '16px',
              color: '#000'
            }}>
              {rightColumn.description}
            </p>
          )}
          {rightColumn.fields.map((field, index) => {
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: 'clamp(16px, 2vh, 28px)' }}>
                {field.label && (
                  <label style={{ 
                    display: 'block', 
                    fontWeight: 'bold', 
                    marginBottom: '12px',
                    fontFamily: "'Gotham Narrow', Arial, sans-serif",
                    fontSize: '16px',
                    color: '#000'
                  }}>
                    {field.label}:
                  </label>
                )}
                <textarea
                  ref={(el) => rightTextareaRefs.current[index] = el}
                  className="exercise-textarea"
                  value={getFieldValue(field.label)}
                  onChange={(e) => updateFieldValue(field.label, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, false, index)}
                  disabled={readonly}
                  placeholder={field.placeholder}
                  required={field.required}
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
                    minHeight: getTextareaMinHeight(field.placeholder)
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnExercise;
