import { dashBoardLinks, roleBasedPathPermissions } from "@/utils/constants";
import Logo from "./Logo";
import { NavLink, useLocation, useNavigate } from "react-router";
import Logout from "./Logout";
import { useEffect } from "react";

export default function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const roles = ["patient", "doctor", "admin", "nurse", "staff"];
  //match user role based of our roles array using the find method
  const userRole = roles.find((role) => role === user?.role);
  const isAuthorized =
    (userRole === "admin" && roleBasedPathPermissions.admin.allowedSubpaths) ||
    (userRole === "doctor" &&
      roleBasedPathPermissions.doctor.allowedSubpaths) ||
    (userRole === "patient" &&
      roleBasedPathPermissions.patient.allowedSubpaths) ||
    (userRole === "nurse" && roleBasedPathPermissions.nurse.allowedSubpaths) ||
    (userRole === "staff" && roleBasedPathPermissions.staff.allowedSubpaths);

  useEffect(() => {
    const allowedPaths =
      roleBasedPathPermissions[userRole]?.allowedSubpaths || [];
    const isPathAllowed = allowedPaths.includes(path);
    if (!isAuthorized || !isPathAllowed) {
      navigate("/dashboard");
    }
  }, [isAuthorized, navigate, path, userRole]);

  return (
    <aside className="hidden bg-slate-100 lg:block min-h-screen fixed z-50 w-[200px]">
      <div className="p-4">
        <Logo />
      </div>
      <div className="h-[calc(100vh-150px)] overflow-y-auto">
        {dashBoardLinks.map((item) => (
          <div key={item.id}>
            <p className="font-medium text-gray-500 px-3 py-2">
              {item.title === "Management" && userRole === "patient"
                ? ""
                : item.title}
            </p>
            <div className="flex flex-col">
              {item.children
                .filter((subPaths) => {
                  if (
                    roleBasedPathPermissions[userRole] &&
                    isAuthorized.includes(subPaths.href)
                  ) {
                    return true;
                  }
                  return false;
                })
                .map((child) => (
                  <NavLink
                    to={child.href}
                    key={child.id}
                    className={({ isActive }) =>
                      `hover:text-blue-500 transition-all duration-300 px-4 py-2 flex items-center gap-2 ${
                        isActive ||
                        path.split("/")[2] === child.href.split("/")[2]
                          ? "text-blue-500 bg-blue-100 font-bold rounded-full"
                          : "text-black"
                      }`
                    }
                    viewTransition
                    end
                  >
                    <child.Icon />
                    {child.name}
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Logout />
    </aside>
  );
}
