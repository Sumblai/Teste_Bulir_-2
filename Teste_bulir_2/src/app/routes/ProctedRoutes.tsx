import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedComponentProps {
  children: ReactNode; 
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>; 
};

export default ProtectedComponent;
