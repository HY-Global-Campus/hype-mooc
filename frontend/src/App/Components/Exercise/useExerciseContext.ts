import { useContext } from 'react';
import { ExerciseContext } from './ExerciseContext';

/** Returns exercise page context; must be used within ExerciseContext.Provider. */
export function useExerciseContext() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
}
