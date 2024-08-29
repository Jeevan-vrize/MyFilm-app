import  React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home1 from './Home1';
import SearchPage from './SearchPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
