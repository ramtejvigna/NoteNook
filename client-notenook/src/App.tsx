import React from "react"
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom"
import { useAuth, AuthProvider } from "./context/AuthContext";
import SignUp from "./components/SignUp";
import Notes from "./components/Notes";
import SignIn from "./components/SignIn";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuth();
  return token.token ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />}/>
          <Route 
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
