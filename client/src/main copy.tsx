// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SessionProvider } from "./context/SessionProvider.tsx";
import { ExerciseProvider } from "./context/ExerciseProvider.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar.tsx";
import App from "./App.tsx";
import { Container } from "react-bootstrap";
import { AlertProvider } from "./context/AlertProvider.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import Login from "./components/Login.tsx";
import SessionList from "./components/SessionList.tsx";
import PrivateRoute from "./components/routing/PrivateRoute.tsx";
import Validate from "./components/Validate.tsx";
import Register from "./components/Register.tsx";
import setAuthToken from "./utilities/setAuthToken.tsx";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <SessionProvider>
      <ExerciseProvider>
        <AlertProvider>
          <AuthProvider>
            <NavBar />
            {/* <Container className="p-0">
              <App />
            </Container> */}

            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<App />} />
                <Route path="/sessions" element={<SessionList />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/validate" element={<Validate />} />
            </Routes>
          </AuthProvider>
        </AlertProvider>
      </ExerciseProvider>
    </SessionProvider>
  </BrowserRouter>
  // </StrictMode>
);
