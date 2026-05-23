import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload'; //
import ProjectView from './pages/ProjectView';
import SearchStats from './pages/SearchStats';
  
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} /> {/* */}
          <Route path="/view/:id" element={<ProjectView />} />
          <Route path="/search-stats" element={<SearchStats />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;