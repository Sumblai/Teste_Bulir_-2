import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeHeader } from "../components/HomeHeader";
import ProviderServices from "../components/ProviderServices";

export default function HomeClient() {
  const navigate = useNavigate(); 

  useEffect(() => {
  
    const user = localStorage.getItem("user");
    if (!user) {
      
      navigate("/"); 
    }
  }, [navigate]); 

  return (
    <>
      <HomeHeader />
      <ProviderServices />
    </>
  );
}
