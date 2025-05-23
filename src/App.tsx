import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import { AuthProvider } from "./context/AuthProvider.tsx";
// import { AlertProvider } from "./context/AlertProvider.tsx";
// import { ExerciseProvider } from "./context/ExerciseProvider.tsx";

import PrivateRoute from "./components/routing/PrivateRoute.tsx";
import setAuthToken from "./utilities/setAuthToken.tsx";

import Login from "./components/auth/Login.tsx";
import NavBar from "./components/auth/NavBar.tsx";
import Register from "./components/auth/Register.tsx";
import Validate from "./components/auth/Validate.tsx";
import Session from "./components/session/Session.tsx";
import SessionList from "./components/session/SessionList.tsx";

import AllProviders from "./AllProviders.tsx";
import "./App..css";
import { MyProvider } from "./context/MyContext.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("token");
if (token !== null) {
  setAuthToken(token);
}

const App = () => {
  return (
    // <StrictMode>
    <BrowserRouter>
      <AllProviders>
        <MyProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              {/* <Route path="/" element={<MyComponent />} /> */}
              <Route path="/" element={<Session />} />
              <Route path="/sessions" element={<SessionList />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/validate" element={<Validate />} />
          </Routes>
        </MyProvider>
      </AllProviders>
    </BrowserRouter>
    // </StrictMode>
  );
};

export default App;
