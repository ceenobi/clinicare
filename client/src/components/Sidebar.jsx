import { dashBoardLinks } from "@/utils/constants";
import Logo from "./Logo";
import { NavLink, useLocation } from "react-router";
import Logout from "./Logout";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <aside className="hidden bg-slate-100 lg:block min-h-screen fixed z-50 w-[200px]">
      <div className="p-4">
        <Logo />
      </div>
      <div className="h-[calc(100vh-150px)] overflow-y-auto">
        {dashBoardLinks.map((item) => (
          <div key={item.id}>
            <p className="font-medium text-gray-500 px-3 py-2">{item.title}</p>
            <div className="flex flex-col">
              {item.children.map((child) => (
                <NavLink
                  to={child.href}
                  key={child.id}
                  className={({ isActive }) =>
                    `hover:text-blue-500 transition-all duration-300 px-4 py-2 flex items-center gap-2 ${
                      isActive ||
                      path.split("/")[2] === child.href.split("/")[2]
                        ? "text-blue-500 bg-blue-100 font-bold rounded-full"
                        : "text-[var(--paint-white)]"
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
