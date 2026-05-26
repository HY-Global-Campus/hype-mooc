import { createContext } from 'react';
import { Course } from '../../api/courseService';

export interface ExerciseContextProps {
  bookOne: Course | null;
  loading: boolean;
  error: string | null;
  readonly: boolean;
  onUpdateBookOne: (update: Partial<Course> | ((current: Course) => Course)) => void;
}

export const ExerciseContext = createContext<ExerciseContextProps | undefined>(undefined);
