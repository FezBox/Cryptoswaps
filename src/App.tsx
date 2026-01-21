import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Swap from './pages/Swap';
import Explorer from './pages/Explorer';
import About from './pages/About';
import Docs from './pages/Docs';
import NotFound from './pages/NotFound';

// Styles
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
