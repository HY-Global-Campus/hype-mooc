import React, { useCallback, useRef } from 'react';
import { useExerciseContext } from './useExerciseContext';
import { ExerciseMeta } from '../../../content/exercises';
import { useCurrentExerciseMeta } from './useCurrentExerciseMeta';
import {
  getFieldDescription,
  getFieldDisplayLabel,
  getFieldPlaceholder,
} from '../../../content/fieldCopy';
import { CanvasExerciseId, getTwoColumnFieldMap } from './exerciseDataHelpers';
import { Course } from '../../api/courseService';

type TwoColumnExerciseProps = {
  exerciseMeta?: ExerciseMeta;
};

const TwoColumnExercise: React.FC<TwoColumnExerciseProps> = ({ exerciseMeta: metaOverride }) => {
  const { bookOne, onUpdateBookOne, readonly } = useExerciseContext();
  const meta = useCurrentExerciseMeta(metaOverride);

  const leftTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const rightTextareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    isLeft: boolean,
    index: number
  ) => {
    if (
      isLeft &&
      (e.key === 'Tab' ||
        (e.key === 'ArrowRight' &&
          e.currentTarget.selectionStart === e.currentTarget.value.length))
    ) {
      e.preventDefault();
      rightTextareaRefs.current[index]?.focus();
    } else if (!isLeft && e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      leftTextareaRefs.current[index]?.focus();
    }
  };

  if (!meta) return null;

  if (!meta?.props?.leftColumn || !meta?.props?.rightColumn) {
    return <div>Invalid exercise configuration</div>;
  }

  const { leftColumn, rightColumn } = meta.props;
  const rightHasContent =
    Boolean(rightColumn.title) ||
    Boolean(rightColumn.description) ||
    (rightColumn.fields?.length ?? 0) > 0;
  const isSingleColumn = !rightHasContent;

  const getTextareaMinHeight = () => 'clamp(140px, 18vh, 220px)';

  const renderField = (
    field: { label: string; placeholder: string; required?: boolean },
    index: number,
    isLeft: boolean
  ) => {
    const description = getFieldDescription(meta.id, field.label);
    const displayLabel = getFieldDisplayLabel(meta.id, field.label);
    const placeholder = getFieldPlaceholder(meta.id, field.label, field.placeholder);
    const columnTitle = isLeft ? leftColumn.title : rightColumn.title;
    const fieldsInColumn = isLeft ? leftColumn.fields : rightColumn.fields;
    const skipLabel =
      fieldsInColumn.length === 1 && displayLabel === columnTitle;

    if (readonly) {
      const value = getFieldValue(field.label);
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
      <div
        key={index}
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 'clamp(16px, 2vh, 28px)' }}
      >
        {!skipLabel && (
          <label
            style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: description ? '8px' : '12px',
              fontFamily: "'Gotham Narrow', Arial, sans-serif",
              fontSize: '16px',
              color: '#000',
            }}
          >
            {displayLabel}
          </label>
        )}
        {description && (
          <p
            className="exercise-description"
            style={{ marginBottom: '12px', lineHeight: '1.5', fontSize: '16px', color: '#000' }}
          >
            {description}
          </p>
        )}
        <textarea
          ref={(el) => {
            if (isLeft) leftTextareaRefs.current[index] = el;
            else rightTextareaRefs.current[index] = el;
          }}
          className="exercise-textarea"
          value={getFieldValue(field.label)}
          onChange={(e) => updateFieldValue(field.label, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, isLeft, index)}
          disabled={readonly}
          placeholder={placeholder}
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
            minHeight: getTextareaMinHeight(),
          }}
        />
      </div>
    );
  };

  return (
    <div className="exercise-content">
      {readonly && meta.title && (
        <h2 className="exercise-title" style={{ marginBottom: '24px' }}>
          {meta.title}
        </h2>
      )}
      <div
        className={`exercise-two-column${isSingleColumn ? ' exercise-two-column--single' : ''}`}
      >
        <div className="exercise-column">
          <h2 className="exercise-title">{leftColumn.title}</h2>
          {leftColumn.description && (
            <p
              className="exercise-description"
              style={{
                marginBottom: '24px',
                lineHeight: '1.5',
                fontSize: '16px',
                color: '#000',
              }}
            >
              {leftColumn.description}
            </p>
          )}
          {leftColumn.fields.map((field, index) => renderField(field, index, true))}
        </div>
        {!isSingleColumn && (
          <div className="exercise-column">
            {!rightColumn.title && leftColumn.title && (
              <div className="exercise-column-header-spacer" aria-hidden="true" />
            )}
            {rightColumn.title && <h2 className="exercise-title">{rightColumn.title}</h2>}
            {rightColumn.description && (
              <p
                className="exercise-description"
                style={{
                  marginBottom: '24px',
                  lineHeight: '1.5',
                  fontSize: '16px',
                  color: '#000',
                }}
              >
                {rightColumn.description}
              </p>
            )}
            {rightColumn.fields.map((field, index) => renderField(field, index, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoColumnExercise;
