import React from "react";
import AuthForm from "../../components/AuthForm";

interface AuthPageProps {
  type: "login" | "register";
}

const AuthPage: React.FC<AuthPageProps> = ({ type }) => {
  const isLogin = type === "login";

  return (
    <div className="flex justify-center items-center w-full h-[calc(100vh-80px)]">
      {" "}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        {" "}
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          {isLogin ? "Bem-vindo de Volta" : "Junte-se ao TaskFlow"}
        </h2>
        <AuthForm isLogin={isLogin} />
      </div>
    </div>
  );
};

export default AuthPage;
