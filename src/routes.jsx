import { Routes, Route, Navigate } from 'react-router-dom';
import DrillPage from './components/drills/DrillPage';
import CheatSheetView from './components/cheatsheet/CheatSheetView';
import WeeklySchedule from './components/schedule/WeeklySchedule';
import PostMortemList from './components/postmortem/PostMortemList';
import PostMortemForm from './components/postmortem/PostMortemForm';
import PostMortemDetail from './components/postmortem/PostMortemDetail';

export default function AppRoutes({ selectedGame }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/drills" replace />} />
      <Route path="/drills" element={<DrillPage selectedGame={selectedGame} />} />
      <Route path="/cheatsheet" element={<CheatSheetView selectedGame={selectedGame} />} />
      <Route path="/schedule" element={<WeeklySchedule />} />
      <Route path="/postmortem" element={<PostMortemList />} />
      <Route path="/postmortem/new" element={<PostMortemForm />} />
      <Route path="/postmortem/:id" element={<PostMortemDetail />} />
      <Route path="/postmortem/:id/edit" element={<PostMortemForm />} />
    </Routes>
  );
}
