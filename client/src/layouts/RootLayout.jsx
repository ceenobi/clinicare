import Logo from "@/components/Logo";
import { RiCopyrightFill } from "@remixicon/react";
import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F3F7FF]">
        <div className="container mx-auto py-5 px-4 flex justify-between items-center">
          <Logo />
          <div className="flex gap-4 items-center">
            <a href="#features" className="font-medium hidden md:block">
              Features
            </a>
            <a href="#howitworks" className="font-medium hidden md:block">
              How it works
            </a>
            {["contact"].map((item) => (
              <NavLink
                to={`/${item}`}
                key={item}
                className={({ isActive }) =>
                  `hover:text-blue-500 transition-all duration-300 capitalize font-medium ${
                    isActive ? "text-blue-500" : ""
                  }`
                }
              >
                {item.concat(" ", "Us")}
              </NavLink>
            ))}
          </div>
          <NavLink to="/account/signup" className="hidden md:block">
            <button className="btn bg-blue-500 hover:bg-blue-600 text-white">
              Get Started
            </button>
          </NavLink>
        </div>
      </div>
      <Outlet />
      <div className="bg-blue-800 py-4">
        <div className="container mx-auto py-5 px-4">
          <div className="flex gap-1 items-center text-white">
            <RiCopyrightFill size={18} />
            <span className="text-sm">
              {new Date().getFullYear()} Clinicare. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
