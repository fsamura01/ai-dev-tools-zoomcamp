import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Interview } from './pages/Interview';
import { Landing } from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/session/:id" element={<Interview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
