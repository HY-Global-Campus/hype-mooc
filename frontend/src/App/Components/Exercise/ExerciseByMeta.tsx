import React from 'react';
import { ExerciseMeta } from '../../../content/exercises';
import TextExercise from './TextExercise';
import TableExercise from './TableExercise';
import TwoColumnExercise from './TwoColumnExercise';
import LearningObjectivesExercise from './LearningObjectivesExercise';

type ExerciseByMetaProps = {
  exerciseMeta: ExerciseMeta;
};

/** Renders the correct exercise component for a given metadata entry. */
const ExerciseByMeta: React.FC<ExerciseByMetaProps> = ({ exerciseMeta }) => {
  if (exerciseMeta.id === 'learningObjectives') {
    return <LearningObjectivesExercise exerciseMeta={exerciseMeta} />;
  }
  if (exerciseMeta.type === 'text') {
    return <TextExercise exerciseMeta={exerciseMeta} />;
  }
  if (exerciseMeta.type === 'table') {
    return <TableExercise exerciseMeta={exerciseMeta} />;
  }
  if (exerciseMeta.type === 'two-column') {
    return <TwoColumnExercise exerciseMeta={exerciseMeta} />;
  }
  return <TextExercise exerciseMeta={exerciseMeta} />;
};

export default ExerciseByMeta;
