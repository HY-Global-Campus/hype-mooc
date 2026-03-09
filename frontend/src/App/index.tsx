import { Routes, Route, useLocation } from 'react-router-dom';
import FrontPage from './Pages/Frontpage';
import AssignmentPage from './Pages/Assignment';
import Part1Page from './Pages/Part1';
import Part2Page from './Pages/Part2';
import Part3Page from './Pages/Part3';
import Part4Page from './Pages/Part4';
import Part5Page from './Pages/Part5';
import ExercisePage from './Pages/ExercisePage';
import gothamNarrow from '../assets/Gotham-Narrow-Font-Family/GothamNarrow-Book.otf';
import EndPage from './Pages/EndPage';
import ProtectedRoute from './Components/ProtectedRoute';
import AppLayout from './Components/AppLayout';
import Login from './Components/Login';
import Logout from './Components/Logout';
import ViewAllExercises from './Pages/View';
import TextExercise from './Components/Exercise/TextExercise';
import TableExercise from './Components/Exercise/TableExercise';
import TwoColumnExercise from './Components/Exercise/TwoColumnExercise';
import LearningObjectivesExercise from './Components/Exercise/LearningObjectivesExercise';
import { exercisesMeta } from '../content/exercises';
import './Pages/pages.css';

// Order matches the course canvas flow
const pages = [
  { path: '/', label: 'FrontPage', color: 'white' },
  { path: '/assignment', label: 'Assignment', color: 'black' },
  { path: '/part1', label: 'Part 1', color: 'black' },
  { path: exercisesMeta[0].route, label: exercisesMeta[0].title, color: 'black' },
  { path: '/part2', label: 'Part 2', color: 'black' },
  { path: exercisesMeta[1].route, label: exercisesMeta[1].title, color: 'black' },
  { path: exercisesMeta[2].route, label: exercisesMeta[2].title, color: 'black' },
  { path: '/part3', label: 'Part 3', color: 'black' },
  { path: exercisesMeta[3].route, label: exercisesMeta[3].title, color: 'black' },
  { path: '/part4', label: 'Part 4', color: 'black' },
  { path: exercisesMeta[4].route, label: exercisesMeta[4].title, color: 'black' },
  { path: '/part5', label: 'Part 5', color: 'black' },
  { path: exercisesMeta[5].route, label: exercisesMeta[5].title, color: 'black' },
  { path: exercisesMeta[6].route, label: exercisesMeta[6].title, color: 'black' },
  { path: '/endpage', label: 'Share your course canvas', color: 'black' },
];

function App() {
  const myFontFace = `
    @font-face {
      font-family: 'Gotham Narrow';
      src: url(${gothamNarrow}) format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: 'Gotham Narrow', sans-serif;
    }
  `;

  const location = useLocation();
  const currentPageIndex = pages.findIndex(page => page.path === location.pathname);

  return (
    <>
      <style>
        {myFontFace}
      </style>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/view/:userId" element={<ViewAllExercises />} />
        <Route
          path="/"
          element={
            <AppLayout pages={pages} currentPageIndex={currentPageIndex}>
              <ProtectedRoute />
            </AppLayout>
          }
        >
          <Route path="/" element={<FrontPage />} />
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route path="/part1" element={<Part1Page />} />
          <Route path="/part2" element={<Part2Page />} />
          <Route path="/part3" element={<Part3Page />} />
          <Route path="/part4" element={<Part4Page />} />
          <Route path="/part5" element={<Part5Page />} />
          <Route path="/exercise" element={<ExercisePage />}>
            {exercisesMeta.map(meta => (
              <Route
                key={meta.id}
                path={meta.route.replace('/exercise/', '')}
                element={
                  meta.id === 'learningObjectives' ? <LearningObjectivesExercise /> :
                  meta.type === 'text' ? <TextExercise /> :
                  meta.type === 'table' ? <TableExercise /> :
                  meta.type === 'two-column' ? <TwoColumnExercise /> :
                  <TextExercise />
                }
              />
            ))}
          </Route>
          <Route path="/endpage" element={<EndPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

