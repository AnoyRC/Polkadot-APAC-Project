"use client";
import React from "react";
import Navbar from "../components/Feed/Navbar";
import Sidebar from "../components/Feed/Sidebar";
import Playground from "../components/Playground/Playground";
import OtherMenu from "../components/OtherMenu/OtherMenu";
import Advertisement from "../components/OtherMenu/Advertisements";

const page = () => {
  return (
    <div className="bg-[color:var(--feed)] w-screen">
      <Playground />
      <Sidebar />
      <Navbar />
      <OtherMenu />
      
    </div>
  );
};

export default page;
