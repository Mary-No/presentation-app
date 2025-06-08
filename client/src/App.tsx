import {Route, Routes } from 'react-router-dom';
import './App.css'
import {JoinPage} from "./pages/JoinPage.tsx";
import { PresentationsPage } from './pages/PresentationsPage/PresentationsPage.tsx';
import { PresentationPage } from './pages/PresentationPage/PresentationPage.tsx';
import { AppInitializer } from './components/AppInitializer.tsx';
import {IoProvider} from "socket.io-react-hook";

function App() {
  return (
      <>
          <AppInitializer />
          <IoProvider>
          <Routes>
          <Route path="/" element={<JoinPage />} />
          <Route path="/presentations" element={<PresentationsPage />} />
          <Route path="/presentations/:id" element={<PresentationPage />} />
          </Routes>
          </IoProvider>
      </>
  )
}

export default App
