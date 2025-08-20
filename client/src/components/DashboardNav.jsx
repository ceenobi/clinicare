import { RiSearchLine } from "@remixicon/react";
import { getTimeBasedGreeting } from "@/utils/constants";

export default function DashboardNav({ user }) {
  const greeting = getTimeBasedGreeting();
  return (
    <div className="hidden lg:block sticky top-2 right-0 z-30 left-[200px] bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-zinc-200 rounded-full mx-4">
      <div className="container mx-auto py-[14px] px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-foreground">
            {greeting}, {user?.fullname}! 👋
          </h1>
          <div className="flex gap-4 items-center">
            <label className="input w-[250px]">
              <RiSearchLine className="text-gray-500" size={28} />
              <input type="search" className="grow" placeholder="Search..." />
            </label>
            <div className="flex gap-2 items-center">
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full bg-gray-300 text-gray-600 border-2 border-gray-300">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt={user?.fullname }
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      priority="high"
                    />
                  ) : (
                    <span className="text-sm">
                      {user?.fullname
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
