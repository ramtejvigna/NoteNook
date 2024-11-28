import React from "react";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import SignUp from "./components/SignUp";
import Notes from "./components/Notes";
import SignIn from "./components/SignIn";
import CreateNote from "./components/Notes/CreateNote";
import NoteDetails from "./components/Notes/NoteDetails";
import { Toaster } from "sonner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/signin" />;
};

function AppContent() {
  const { token } = useAuth();
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/notes" /> : <SignUp />} />
          <Route path="/signin" element={token ? <Navigate to="/notes" /> : <SignIn />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createNote"
            element={
              <ProtectedRoute>
                <CreateNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/noteDetails"
            element={
              <ProtectedRoute>
                <NoteDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
