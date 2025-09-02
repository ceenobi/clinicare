import { useAuth } from "@/store";
import { formatDate, usersRoleColors } from "@/utils/constants";
import { RiPhoneLine } from "@remixicon/react";
import { useState } from "react";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";

export default function UsersCard({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();

  return (
    <>
      <div
        className="card border border-slate-200 rounded-xl shadow bg-white"
        key={item._id}
      >
        <div className="card-body">
          <div className="flex gap-2">
            <div>
              <div className="avatar avatar-placeholder">
                <div className="w-12 rounded-full bg-gray-300">
                  {item?.avatar ? (
                    <img
                      src={item?.avatar}
                      alt={item?.fullname.split(" ")[0].charAt(0)}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-md">
                      {item?.fullname
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="card-title capitalize">{item.fullname}</h2>
              <a
                href={`mailto:${item?.email}`}
                target="_blank"
                title="Send email"
                className="text-gray-500 font-medium"
              >
                {item?.email}
              </a>
              <div>
                <div
                  className={`capitalize badge badge-sm font-semibold my-2 ${
                    usersRoleColors[item.role]
                  }`}
                >
                  {item.role}
                </div>

                <div className="flex items-center gap-1 text-gray-500 ">
                  <RiPhoneLine size={16} />
                  <a
                    href={`tel:${item?.phone || ""}`}
                    className="font-medium text-sm"
                  >
                    {item.phone || "N/A"}
                  </a>
                </div>

                <div>
                  <p className="text-gray-500 font-medium">
                    Joined: {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {user?.role === "admin" && (
            <div className="mt-2 card-actions justify-end">
              <button
                className="btn btn-sm"
                onClick={() => {
                  setIsOpen(true);
                  setUserId(item._id);
                }}
                disabled={item.role === "patient"}
              >
                Edit
              </button>
              <button
                className="btn btn-sm bg-red-500 text-white"
                onClick={() => {
                  setDeleteModalOpen(true);
                  setUserId(item._id);
                }}
              >
                Delete
              </button>
            </div>
          )}
          {isOpen && item._id === userId && (
            <UpdateUser
              item={item}
              onClose={() => setIsOpen(false)}
              isOpen={isOpen}
            />
          )}
          {deleteModalOpen && item._id === userId && (
            <DeleteUser
              item={item}
              onClose={() => setDeleteModalOpen(false)}
              isOpen={deleteModalOpen}
            />
          )}
        </div>
      </div>
    </>
  );
}
