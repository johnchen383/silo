import Chapter from "./components/Chapter"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CONST_DEFAULT_CHAPTER_URL } from "./consts/bible_data";
import Scaffold from "./components/Scaffold";
import { useAuth } from "./providers/auth_provider";
import Login from "./components/Login";
import { type JSX } from "react";
import { useAppProvider } from "./providers/app_provider";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
}

function IndexRoute({ children }: { children: JSX.Element }) {
  const { setSelectedPage } = useAppProvider();
  setSelectedPage("read")
  return children;
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
          <Route path="/" element={<IndexRoute><Navigate to={`${CONST_DEFAULT_CHAPTER_URL}`} replace /></IndexRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/read/:book/:chapter/:verse?" element={<PrivateRoute><Chapter /></PrivateRoute>} />
          <Route path="/read" element={<Navigate to={`${CONST_DEFAULT_CHAPTER_URL}`} replace />} />
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