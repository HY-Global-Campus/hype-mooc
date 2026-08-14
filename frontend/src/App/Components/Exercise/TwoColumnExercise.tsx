import React, { useCallback, useRef } from 'react';
import { useExerciseContext } from './useExerciseContext';
import { ExerciseFieldMeta, ExerciseMeta } from '../../../content/exercises';
import { useCurrentExerciseMeta } from './useCurrentExerciseMeta';
import {
  getAnswerPlaceholder,
  getFieldDescription,
  getFieldDisplayLabel,
} from '../../../content/fieldCopy';
import { CanvasExerciseId, getTwoColumnFieldMap } from './exerciseDataHelpers';
import { Course } from '../../api/courseService';
import WordLimitedTextarea from './WordLimitedTextarea';

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
    pairIndex: number
  ) => {
    if (
      isLeft &&
      (e.key === 'Tab' ||
        (e.key === 'ArrowRight' &&
          e.currentTarget.selectionStart === e.currentTarget.value.length))
    ) {
      e.preventDefault();
      rightTextareaRefs.current[pairIndex]?.focus();
    } else if (!isLeft && e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      leftTextareaRefs.current[pairIndex]?.focus();
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

  const leftFields = leftColumn.fields ?? [];
  const rightFields = rightColumn.fields ?? [];
  const usePairedFieldRows =
    !isSingleColumn &&
    leftFields.length > 0 &&
    rightFields.length > 0 &&
    (leftFields.length > 1 || rightFields.length > 1);

  const getTextareaMinHeight = () => 'clamp(140px, 18vh, 220px)';

  const shouldSkipFieldLabel = (field: ExerciseFieldMeta, isLeft: boolean) => {
    const displayLabel = getFieldDisplayLabel(meta.id, field.label);
    const columnTitle = isLeft ? leftColumn.title : rightColumn.title;
    const fieldsInColumn = isLeft ? leftFields : rightFields;
    return fieldsInColumn.length === 1 && displayLabel === columnTitle;
  };

  const renderFieldBlock = (
    field: ExerciseFieldMeta | undefined,
    pairIndex: number,
    isLeft: boolean
  ) => {
    if (!field) {
      return (
        <div
          className="exercise-field-block exercise-field-block--empty"
          aria-hidden="true"
        />
      );
    }

    const description = getFieldDescription(meta.id, field.label);
    const displayLabel = getFieldDisplayLabel(meta.id, field.label);
    const placeholder = getAnswerPlaceholder(field.wordLimit);
    const skipLabel = shouldSkipFieldLabel(field, isLeft);
    const value = getFieldValue(field.label);

    if (readonly) {
      return (
        <div className="exercise-field-block">
          {skipLabel ? (
            <span className="exercise-field-label-spacer" aria-hidden="true" />
          ) : (
            <label className="exercise-field-label">{displayLabel}</label>
          )}
          {description ? (
            <p className="exercise-field-description">{description}</p>
          ) : (
            <span className="exercise-field-description-spacer" aria-hidden="true" />
          )}
          <div className={`readonly-text${value ? '' : ' readonly-text--empty'}`}>
            {value || 'No answer provided'}
          </div>
        </div>
      );
    }

    return (
      <div className="exercise-field-block">
        {skipLabel ? (
          <span className="exercise-field-label-spacer" aria-hidden="true" />
        ) : (
          <label className="exercise-field-label">{displayLabel}</label>
        )}
        {description ? (
          <p className="exercise-field-description">{description}</p>
        ) : (
          <span className="exercise-field-description-spacer" aria-hidden="true" />
        )}
        <WordLimitedTextarea
          ref={(el) => {
            if (isLeft) leftTextareaRefs.current[pairIndex] = el;
            else rightTextareaRefs.current[pairIndex] = el;
          }}
          className="exercise-textarea exercise-field-textarea"
          value={value}
          wordLimit={field.wordLimit}
          onValueChange={(next) => updateFieldValue(field.label, next)}
          onKeyDown={(e) => handleKeyDown(e, isLeft, pairIndex)}
          placeholder={placeholder}
          required={field.required}
          style={{ minHeight: getTextareaMinHeight() }}
        />
      </div>
    );
  };

  const renderColumnLayout = () => (
    <>
      <div className="exercise-column">
        <h2 className="exercise-title">{leftColumn.title}</h2>
        {leftColumn.description && (
          <p className="exercise-description exercise-column-intro">{leftColumn.description}</p>
        )}
        {leftFields.map((field, index) => renderFieldBlock(field, index, true))}
      </div>
      {!isSingleColumn && (
        <div className="exercise-column">
          {!rightColumn.title && leftColumn.title && (
            <div className="exercise-column-header-spacer" aria-hidden="true" />
          )}
          {rightColumn.title && <h2 className="exercise-title">{rightColumn.title}</h2>}
          {rightColumn.description && (
            <p className="exercise-description exercise-column-intro">{rightColumn.description}</p>
          )}
          {rightFields.map((field, index) => renderFieldBlock(field, index, false))}
        </div>
      )}
    </>
  );

  const renderPairedFieldRows = () => {
    const pairCount = Math.max(leftFields.length, rightFields.length);

    return (
      <>
        <h2 className="exercise-title">{leftColumn.title}</h2>
        <h2 className="exercise-title">{rightColumn.title}</h2>
        {leftColumn.description && (
          <p className="exercise-description exercise-column-intro">{leftColumn.description}</p>
        )}
        {rightColumn.description && (
          <p className="exercise-description exercise-column-intro">{rightColumn.description}</p>
        )}
        {Array.from({ length: pairCount }, (_, pairIndex) => {
          const leftField = leftFields[pairIndex];
          const rightField = rightFields[pairIndex];
          const isOrphanRow = !leftField || !rightField;

          return (
            <div
              key={pairIndex}
              className={`exercise-field-pair${isOrphanRow ? ' exercise-field-pair--orphan' : ''}`}
            >
              {renderFieldBlock(leftField, pairIndex, true)}
              {renderFieldBlock(rightField, pairIndex, false)}
            </div>
          );
        })}
      </>
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
        className={`exercise-two-column${
          isSingleColumn ? ' exercise-two-column--single' : ''
        }${usePairedFieldRows ? ' exercise-two-column--paired-fields' : ''}`}
      >
        {usePairedFieldRows ? renderPairedFieldRows() : renderColumnLayout()}
      </div>
    </div>
  );
};

export default TwoColumnExercise;
