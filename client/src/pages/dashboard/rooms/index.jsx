import { getAllRooms } from "@/api/room";
import PageWrapper from "@/components/PageWrapper";
import Search from "@/components/Search";
import AddRoom from "@/features/rooms/AddRoom";
import Filter from "@/features/rooms/Filter";
import usePaginate from "@/hooks/usePaginate";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { lazy, Suspense } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import { SkeletonTable } from "@/components/LazyLoader";
import Paginate from "@/components/paginate";
import useMetaArgs from "@/hooks/useMeta";
const Table = lazy(() => import("@/features/rooms/Table"));

export default function Rooms() {
  useMetaArgs({
    title: "Rooms - Clinicare",
    description: "Manage your rooms.",
    keywords: "Clinicare, rooms, account",
  });
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getAllRooms", page, limit, query, roomType, roomStatus],
    queryFn: () => getAllRooms(searchParams, accessToken),
  });
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  const rooms = data?.data?.data?.rooms || [];

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Rooms</h1>
          <p className="text-gray-500">Manage your rooms</p>
        </div>
        <AddRoom />
      </div>
      <div className="mt-8 space-y-6">
        <div className="flex justify-end items-center">
          <Search id="search-rooms">
            <Filter />
          </Search>
        </div>
        {isPending ? (
          <SkeletonTable />
        ) : (
          <>
            {isError ? (
              <ErrorAlert error={error?.response?.data?.message} />
            ) : (
              <>
                {rooms?.length > 0 ? (
                  <>
                    <Suspense fallback={<SkeletonTable />}>
                      <Table rooms={rooms} />
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
                    No rooms found
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
