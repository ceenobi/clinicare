import { getAllUsers } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import { SkeletonCard } from "@/components/LazyLoader";
import PageWrapper from "@/components/PageWrapper";
import Search from "@/components/Search";
import Filter from "@/features/users/Filter";
import { useSearchParams } from "react-router";
import AddUser from "@/features/users/AddUser";
import usePaginate from "@/hooks/usePaginate";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import Paginate from "@/components/paginate";
import useMetaArgs from "@/hooks/useMeta";
const UsersCard = lazy(() => import("@/features/users/UsersCard"));

export default function Users() {
  useMetaArgs({
    title: "User",
    description: "User",
    keywords: "Clinicare, user, account",
  });
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getAllUsers", page, limit, query, role],
    queryFn: () => getAllUsers(searchParams, accessToken),
  });

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  const users = data?.data?.data?.users || [];
  //lll
  return (
    <PageWrapper>
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Users</h1>
          <p className="text-gray-500">Manage your account settings</p>
        </div>
        <AddUser />
      </div>
      <div className="mt-8 space-y-6">
        <div className="flex justify-end items-center">
          <Search id="search-users">
            <Filter />
          </Search>
        </div>
        {isPending ? (
          <SkeletonCard />
        ) : (
          <>
            {isError ? (
              <ErrorAlert error={error?.response?.data?.message} />
            ) : (
              <>
                {users?.length > 0 ? (
                  <>
                    <Suspense fallback={<SkeletonCard />}>
                      <div className="grid grid-cols-12 gap-2">
                        {users.map((item) => (
                          <div
                            key={item._id}
                            className="col-span-12 md:col-span-6 lg:col-span-4"
                          >
                            <UsersCard item={item} />
                          </div>
                        ))}
                      </div>
                    </Suspense>
                    <Paginate
                      totalPages={totalPages}
                      hasMore={hasMore}
                      handlePageChange={handlePageChange}
                      currentPage={currentPage}
                    />
                  </>
                ) : (
                  <p className="mt-10 font-semibold text-center">
                    No users found
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
