import DashboardNav from "@/components/DashboardNav";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/store";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const { user } = useAuth();
  return (
    <>
      <section className="min-h-screen bg-slate-100">
        <Sidebar user={user} />
        <div className="lg:ml-[200px] flex-1">
          <DashboardNav user={user} />
          <MobileNav user={user} />
          <Outlet />
        </div>
      </section>
    </>
  );
}
