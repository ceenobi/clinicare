import Logo from "@/components/Logo";
import Logout from "@/components/Logout";
import { RiCopyrightFill } from "@remixicon/react";
import { Outlet } from "react-router";

export default function OnboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="flex justify-between items-center">
        <Logo />
        <Logout />
        {/* <form action="/logout" method="post">
          <button
            type="submit"
            className="btn bg-red-500 hover:bg-red-600 text-white w-fit"
          >
            Logout
          </button>
        </form> */}
      </div>
      <Outlet />
      <div className="flex justify-center md:justify-start items-center text-gray-600">
        <div className="flex gap-1 items-center">
          <RiCopyrightFill size={18} />
          <span className="text-sm">
            {new Date().getFullYear()} Clinicare. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
