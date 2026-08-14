// import React, { useRef, CSSProperties } from 'react';
import React, { useRef, useCallback } from 'react';
import '../pages.css'
import { Navigate, Outlet } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import Header from '../../Components/Header';
import { getCourseByUserId, updateCourse, Course } from '../../api/courseService';
import { ExerciseContext } from '../../Components/Exercise/ExerciseContext';
import { writeWithSyncNotify } from '../../utils/queryClient';
import axios from 'axios';

// Define the type for the mutation context
type MutationContext = {
  previousData?: Course;
};

const ExercisePage: React.FC = () => {
  const queryClient = useQueryClient();
  const userId = sessionStorage.getItem('id');

  // Use `useQuery` to fetch the bookOne data
  const { data: bookOne, isLoading: loading, error } = useQuery<Course, Error>({
    queryKey: ['course', userId], // Unique query key
    queryFn: () => getCourseByUserId(userId!), // Query function
    enabled: !!userId, // Only run if userId exists
  }, queryClient);



  // Mutation for updating BookOne
  const mutation = useMutation<Course, Error, Partial<Course>, MutationContext>({
    mutationFn: async (updatedBook: Partial<Course>) => {
      // Get the current optimistic data from the cache instead of using stale bookOne
      const currentData = queryClient.getQueryData<Course>(['course', userId]);
      if (!currentData) {
        throw new Error('Course data is not defined');
      }
      return await updateCourse(currentData.id, updatedBook);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ['course', userId],
      }); // Cancel queries to ensure fresh data
      const previousData = queryClient.getQueryData<Course>(['course', userId]);
      queryClient.setQueryData<Course>(['course', userId], (old) => {
        if (!old) {
          throw new Error('bookOne is not defined');
        }
        return { ...old, ...newData };
      });
      return { previousData };
    },
    onError: (error, _newData, context) => {
      console.error('Error updating BookOne:', error);
      if (context?.previousData) {
        queryClient.setQueryData<Course>(['course', userId], context.previousData);
      }
    },
  });

  // Immediate UI update function (no debounce, no server calls)
  const updateBookOneImmediate = useCallback((updateFn: Partial<Course> | ((current: Course) => Course)) => {
    // Answer fields are controlled by this cache entry, so the re-render must land inside
    // the keystroke's own event or React reverts the input to its pre-keystroke value.
    writeWithSyncNotify(() => {
      queryClient.setQueryData<Course>(['course', userId], (old) => {
        if (!old) return old;

        if (typeof updateFn === 'function') {
          return updateFn(old);
        } else {
          return { ...old, ...updateFn };
        }
      });
    });
  }, [queryClient, userId]);

  // Debounced server save function
  const debouncedSaveToServer = useRef(
    debounce(() => {
      const currentData = queryClient.getQueryData<Course>(['course', userId]);
      if (currentData) {
        mutation.mutate(currentData);
      }
    }, 1000)
  ).current;

  // Combined function that updates UI immediately and saves to server later
  const onUpdateBookOne = useCallback((updateFn: Partial<Course> | ((current: Course) => Course)) => {
    updateBookOneImmediate(updateFn);
    debouncedSaveToServer();
  }, [updateBookOneImmediate, debouncedSaveToServer]);


  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      sessionStorage.clear();
      return <Navigate to ="/login" />;
      }
  }

  return (
    <div className="page-with-header">
      <Header />
      <div className="exercise-page">
        <ExerciseContext.Provider value={{ bookOne: bookOne || null, loading, error: error?.message || null, readonly: false, onUpdateBookOne }}>
          <Outlet />
        </ExerciseContext.Provider>
      </div>
    </div>
  );
};

export default ExercisePage;
