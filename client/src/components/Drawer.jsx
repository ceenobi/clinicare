import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { dashBoardLinks, roleBasedPathPermissions } from "../utils/constants";
import Logout from "./logout";

export default function Drawer({ user }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleDrawer = () => setOpen(!open);
  const path = location.pathname;
  const roles = ["patient", "doctor", "admin", "nurse", "staff"];
  const userRole = roles.find((role) => role === user?.role);
  const isAuthorized =
    (userRole === "admin" && roleBasedPathPermissions.admin.allowedSubpaths) ||
    (userRole === "doctor" &&
      roleBasedPathPermissions.doctor.allowedSubpaths) ||
    (userRole === "patient" &&
      roleBasedPathPermissions.patient.allowedSubpaths) ||
    (userRole === "nurse" && roleBasedPathPermissions.nurse.allowedSubpaths);

  useEffect(() => {
    const allowedPaths =
      roleBasedPathPermissions[userRole]?.allowedSubpaths || [];
    const isPathAllowed = allowedPaths.includes(path);
    if (!isAuthorized || !isPathAllowed) {
      navigate("/dashboard");
    }
  }, [isAuthorized, navigate, path, userRole]);
  
  return (
    <>
      <button onClick={toggleDrawer}>
        <RiMenuLine size={24} />
      </button>
      <div className={`drawer fixed top-0 left-0 ${open ? "drawer-open" : ""}`}>
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={open}
          onChange={toggleDrawer}
        />
        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setOpen(false)}
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-[100vw] p-4">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4"
              type="button"
              onClick={toggleDrawer}
            >
              <RiCloseLine size={24} />
            </button>
            <div className="mb-4 flex gap-2 items-center">
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full bg-gray-300 text-gray-600">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt={user?.fullname.split(" ")[0].charAt(0)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-m">
                      {user?.fullname
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h1 className="font-bold text-base">{user?.fullname}</h1>
                <p className="capitalize text-gray-500 text-sm">{user?.role}</p>
              </div>
            </div>
            <div className="h-[calc(100vh-150px)] overflow-y-auto">
              {dashBoardLinks.map((item) => (
                <div key={item.id}>
                  <p className="font-medium text-gray-500 p-3">
                    {item.title === "Management" && userRole == "patient"
                      ? ""
                      : item.title}
                  </p>
                  <div className="flex flex-col">
                    {item.children
                      .filter((child) => {
                        if (
                          roleBasedPathPermissions[userRole] &&
                          isAuthorized.includes(child.href)
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
                                ? "text-blue-500 border-blue-500 bg-blue-100 font-bold rounded-full"
                                : "text-[var(--paint-white)]"
                            }`
                          }
                          onClick={toggleDrawer}
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
          </div>
        </div>
      </div>
    </>
  );
}
