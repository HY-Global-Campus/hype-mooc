import React, { useMemo } from 'react';
import { useExerciseContext } from './useExerciseContext';
import { useCurrentExerciseMeta } from './useCurrentExerciseMeta';
import { ExerciseMeta } from '../../../content/exercises';
import { CanvasExerciseId, getTableExerciseValue } from './exerciseDataHelpers';
import { Course } from '../../api/courseService';
import './exercises.css';

type TableExerciseProps = {
  exerciseMeta?: ExerciseMeta;
};

/** Generates a short placeholder for a table cell input. Column header already provides context. */
const cellPlaceholder = (_header: string): string => 'Type here…';

const TableExercise: React.FC<TableExerciseProps> = ({ exerciseMeta: metaOverride }) => {
  const { bookOne, onUpdateBookOne, readonly } = useExerciseContext();
  const meta = useCurrentExerciseMeta(metaOverride);
  const exerciseId = meta?.id as CanvasExerciseId | undefined;

  const headers =
    meta?.props?.headers ??
    Array.from({ length: meta?.props?.columns ?? 2 }, (_, i) => `Col ${i + 1}`);
  const rows = meta?.props?.rows ?? 3;
  const subTitle = meta?.props?.subTitle;
  const description = meta?.props?.description;

  const storedValue = exerciseId && bookOne ? getTableExerciseValue(bookOne, exerciseId) : undefined;
  const value: string[][] =
    storedValue ?? Array.from({ length: rows }, () => Array(headers.length).fill(''));

  const onCellChange = useMemo(
    () => (r: number, c: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!exerciseId) return;
      const copy = value.map((row) => row.slice());
      copy[r][c] = e.target.value;
      onUpdateBookOne((current: Course) => ({
        ...current,
        exercises: {
          ...current.exercises,
          [exerciseId]: { value: copy },
        },
      }));
    },
    [value, exerciseId, onUpdateBookOne]
  );

  if (!meta) return null;

  const colWidths =
    headers.length === 4
      ? ['28%', '24%', '24%', '24%']
      : headers.length === 3
        ? ['34%', '33%', '33%']
        : headers.map(() => `${100 / headers.length}%`);

  return (
    <div className="exercise-content">
      <div className="exercise-single-column exercise-single-column--left">
        <div className="exercise-panel">
          <h2 className="exercise-title">{meta.title}</h2>
          {subTitle && subTitle !== meta.title && (
            <h3 className="exercise-subtitle">{subTitle}</h3>
          )}
          {description && <p className="exercise-description">{description}</p>}
          <div className="table-exercise-wrapper">
            <table className="table-exercise">
              <colgroup>
                {colWidths.map((width, i) => (
                  <col key={i} style={{ width }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, r) => (
                  <tr key={r}>
                    {headers.map((header, c) => (
                      <td key={c}>
                        {readonly ? (
                          <span className={value?.[r]?.[c] ? '' : 'table-cell-empty'}>
                            {value?.[r]?.[c] || '—'}
                          </span>
                        ) : (
                          <input
                            disabled={readonly}
                            value={value?.[r]?.[c] ?? ''}
                            onChange={onCellChange(r, c)}
                            placeholder={cellPlaceholder(header)}
                            aria-label={`${header}, row ${r + 1}`}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableExercise;
