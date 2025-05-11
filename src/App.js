import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import AcademicYears from './pages/AcademicYears';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import './styles/global.css';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import TeacherLogin from './pages/TeacherLogin';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import VisitorLogin from './pages/VisitorLogin';


function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
          <Route path="/visitor-login" element={<VisitorLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />

            <Route path="/register" element={<Register/>} />
            <Route path="/" element={<Schools />} />  

              <Route element={<Layout />}>
                <Route path="/classes" element={<Classes />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/students" element={<Students />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;