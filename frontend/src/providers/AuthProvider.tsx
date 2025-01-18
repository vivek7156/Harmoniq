import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";

interface AuthContextProps {
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  isAdmin: false,
  loading: true,
});

// Helper to set/remove Authorization header
const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);

        // Now check if user is admin
        const response = await axiosInstance.get("/admin/check");
        setIsAdmin(response.data?.admin || false);
      } catch (error) {
        updateApiToken(null);
        console.error("Error getting token or checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);
export default AuthProvider;