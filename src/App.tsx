import Chapter from "./components/Chapter"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CONST_DEFAULT_CHAPTER_URL } from "./consts/bible_data";
import Scaffold from "./components/Scaffold";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ScaffoldWrapper />}>
          <Route path="/" element={<Navigate to={`${CONST_DEFAULT_CHAPTER_URL}`} replace />} />
          <Route path="/bible/:book/:chapter/:verse?" element={<Chapter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function ScaffoldWrapper() {
  return (
    <Scaffold>
      <Outlet />
    </Scaffold>
  );
}

export default App