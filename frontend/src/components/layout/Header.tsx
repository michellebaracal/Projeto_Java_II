import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link
          to={isAuthenticated ? "/projects" : "/login"}
          className="text-2xl font-bold hover:text-blue-400 transition duration-150"
        >
          TaskFlow 🚀
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/projects"
                className="hover:text-gray-300 transition duration-150"
              >
                Projetos
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-sm transition duration-150"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="hover:text-gray-300 transition duration-150 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className=" hover:text-gray-300 text-sm transition duration-150 hover:text-white"
              >
                Registrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
