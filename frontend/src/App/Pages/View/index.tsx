import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Course } from '../../api/courseService';
import { useParams } from 'react-router';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import '../pages.css';
import { exercisesMeta } from '../../../content/exercises';
import { useViewportHeightVar } from '../../hooks/useViewportVars';
import ExerciseByMeta from '../../Components/Exercise/ExerciseByMeta';
import '../../Components/Exercise/exercises.css';

const ViewAllExercises: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  useViewportHeightVar();

  const { data: bookOne, isLoading: loading, error } = useQuery<Course, Error>({
    queryKey: ['course', userId],
    queryFn: async () => {
      const response = await axios.get<Course>(
        `${import.meta.env.VITE_API_URL}/course/share/${userId}`
      );

      return response.data;
    },
    enabled: !!userId,
  });

  return (
    <div
      className="page-with-header view-all-page"
      style={{
        height: 'var(--app-height, 100dvh)',
        overflow: 'auto',
      }}
    >
      <Header />
      <div className="exercise-container">
        <div className="exercise-content" style={{ width: 'min(100%, 1440px)' }}>
          {error ? (
            <div className="exercise-panel">
              <h2 className="exercise-title">Shared course canvas</h2>
              <p className="exercise-description">
                {axios.isAxiosError(error) && error.response?.status === 404
                  ? 'This shared course canvas could not be found.'
                  : 'This shared course canvas could not be loaded right now.'}
              </p>
              <Link to="/login" style={{ color: '#000', textDecoration: 'underline' }}>
                Go to login
              </Link>
            </div>
          ) : loading ? (
            <p className="exercise-description">Loading shared canvas…</p>
          ) : (
            <ExerciseContext.Provider
              value={{
                bookOne: bookOne || null,
                onUpdateBookOne: () => {},
                loading,
                error: null,
                readonly: true,
              }}
            >
              <nav className="view-page-toc" aria-label="Course canvas sections">
                <p className="view-page-toc-title">Contents</p>
                <ul className="view-page-toc-list">
                  {exercisesMeta.map((meta) => (
                    <li key={meta.id}>
                      <a href={`#${meta.id}`}>{meta.title}</a>
                    </li>
                  ))}
                </ul>
              </nav>
              {exercisesMeta.map((meta) => (
                <section key={meta.id} id={meta.id} className="view-exercise-section">
                  <ExerciseByMeta exerciseMeta={meta} />
                </section>
              ))}
            </ExerciseContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllExercises;
