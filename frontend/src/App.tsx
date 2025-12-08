import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import PrivateRoute from "./components/layout/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/Auth/AuthPage";
import ProjectsDashboard from "./pages/Projects/ProjectsDashboard";
import TaskDetailsPage from "./pages/Projects/TaskDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="w-full min-h-screen bg-gray-100 flex flex-col">
          {" "}
          <Header />
          <main className="flex-grow p-4">
            {" "}
            <div className="max-w-7xl mx-auto">
              {" "}
              <Routes>
                <Route path="/" element={<Navigate to="/projects" />} />
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route
                  path="/register"
                  element={<AuthPage type="register" />}
                />

                <Route element={<PrivateRoute />}>
                  <Route path="/projects" element={<ProjectsDashboard />} />
                  <Route
                    path="/projects/:projectId/tasks"
                    element={<TaskDetailsPage />}
                  />
                </Route>

                <Route
                  path="*"
                  element={<h1>404 - Página Não Encontrada</h1>}
                />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
