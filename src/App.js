import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Chat from './pages/chat/chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={'/'}
          element={<Chat />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
