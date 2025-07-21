import { useState } from "react";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setUser(role);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard userRole={user} onLogout={handleLogout} />;
};

export default Index;
