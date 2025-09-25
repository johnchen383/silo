import Chapter from "./components/Chapter"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CONST_DEFAULT_CHAPTER_URL } from "./consts/bible_data";
import Scaffold from "./components/Scaffold";
import { useAuth } from "./providers/auth_provider";
import Login from "./components/Login";
import { useEffect, type JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
}

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <></>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ScaffoldWrapper />}>
          <Route path="/" element={<Navigate to={`${CONST_DEFAULT_CHAPTER_URL}`} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bible/:book/:chapter/:verse?" element={<PrivateRoute><Chapter /></PrivateRoute>} />
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