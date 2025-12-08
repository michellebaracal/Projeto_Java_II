import { useContext } from "react";

import { AuthContext } from "../context/authContextDeclaration";
import type { AuthContextType } from "../types";

export const useAuth = (): AuthContextType => {
  const context = useContext(
    AuthContext as React.Context<AuthContextType | undefined>
  );

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
