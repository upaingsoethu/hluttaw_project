import Hero from "@/components/Hero";
import Navbar from "@/components/navbar/navbar";

import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="relative h-screen bg-gray-100">
      <Navbar />
      <Hero/>
      
        <Outlet />
     
 
    </div>
  );
};

export default UserLayout;
