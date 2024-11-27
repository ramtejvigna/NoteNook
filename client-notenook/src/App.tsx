import React from "react"
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom"
import { useAuth, AuthProvider } from "./context/AuthContext";
import SignUp from "./components/SignUp";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuth();
  return token ? <>{children}</> : <Navigate to="/" />;
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
