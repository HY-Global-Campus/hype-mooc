import { Course } from '../../api/courseService';
import { CourseExercises } from '../../../types/exercises';

export type CanvasExerciseId = keyof CourseExercises;

/** Field map for two-column canvas exercises (courseInfo, ILOs, etc.). */
export function getTwoColumnFieldMap(
  bookOne: Course | null,
  exerciseId: CanvasExerciseId
): Record<string, string> {
  const data = bookOne?.exercises?.[exerciseId];
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }
  if ('value' in data && typeof (data as { value: unknown }).value === 'string') {
    return {};
  }
  return data as Record<string, string>;
}

/** Text exercise answer stored as `{ value: string }`. */
export function getTextExerciseValue(
  bookOne: Course | null,
  exerciseId: CanvasExerciseId
): string {
  const data = bookOne?.exercises?.[exerciseId];
  if (data && typeof data === 'object' && 'value' in data && typeof data.value === 'string') {
    return data.value;
  }
  return '';
}

/** Table exercise rows stored as `{ value: string[][] }`. */
export function getTableExerciseValue(
  bookOne: Course | null,
  exerciseId: CanvasExerciseId
): string[][] | undefined {
  const data = bookOne?.exercises?.[exerciseId];
  if (data && typeof data === 'object' && 'value' in data && Array.isArray(data.value)) {
    return data.value as string[][];
  }
  return undefined;
}
