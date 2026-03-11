import api from './axiosInstance';
import { CourseExercises } from '../../types/exercises';
import { MindMap } from '../../types/mindmap';

export interface Course {
  id: number;
  exercises: CourseExercises;
  mindmap: MindMap;
  displayName: string;
  reflection: string;
}

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const DEMO_STORAGE_KEY = 'demo_course';

function getDemoCourse(): Course {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const empty: Course = {
    id: 0,
    exercises: {},
    mindmap: { nodes: [], edges: [] },
    displayName: 'Demo User',
    reflection: '',
  };
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(empty));
  return empty;
}

function saveDemoCourse(course: Course): Course {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(course));
  return course;
}

export const getAllCourses = async (): Promise<Course[]> => {
  if (DEMO_MODE) return [getDemoCourse()];
  const response = await api.get<Course[]>('/course');
  return response.data;
};

export const getCourseById = async (id: number): Promise<Course> => {
  if (DEMO_MODE) return getDemoCourse();
  const response = await api.get<Course>(`/course/${id}`);
  return response.data;
};

export const getCourseByUserId = async (id: string): Promise<Course> => {
  if (DEMO_MODE) return getDemoCourse();
  const response = await api.get<Course>(`/course/user/${id}`);
  return response.data;
};

export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  if (DEMO_MODE) return saveDemoCourse({ ...course, id: 0 });
  const response = await api.post<Course>('/course', course);
  return response.data;
};

export const updateCourse = async (id: number, course: Partial<Course>): Promise<Course> => {
  if (DEMO_MODE) {
    const current = getDemoCourse();
    const merged = {
      ...current,
      ...course,
      exercises: { ...current.exercises, ...course.exercises },
    };
    return saveDemoCourse(merged);
  }
  const response = await api.put<Course>(`/course/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  if (DEMO_MODE) {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    return;
  }
  await api.delete(`/course/${id}`);
};
