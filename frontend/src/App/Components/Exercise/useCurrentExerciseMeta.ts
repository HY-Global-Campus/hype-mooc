import { useLocation } from 'react-router-dom';
import { exercisesMeta, ExerciseMeta } from '../../../content/exercises';

/** Resolves exercise metadata from route or an explicit override (e.g. view-only page). */
export function useCurrentExerciseMeta(override?: ExerciseMeta): ExerciseMeta | undefined {
  const location = useLocation();
  if (override) {
    return override;
  }
  return exercisesMeta.find((e) => e.route === location.pathname);
}
