import { getAllDoctors } from "@/api/doctors";
import PageWrapper from "@/components/PageWrapper";
import usePaginate from "@/hooks/usePaginate";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { lazy, Suspense } from "react";
import { SkeletonTable } from "@/components/LazyLoader";
import Search from "@/components/Search";
import Filter from "@/features/doctors/Filter";
import ErrorAlert from "@/components/ErrorAlert";
import Paginate from "@/components/paginate";
import useMetaArgs from "@/hooks/useMeta";
const Table = lazy(() => import("@/features/doctors/Table"));

export default function Doctors() {
  useMetaArgs({
    title: "Doctors - Clinicare",
    description: "Manage your doctors.",
    keywords: "Clinicare, doctors, account",
  });
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const specialization = searchParams.get("specialization") || "";
  const availability = searchParams.get("availability") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: [
      "getAllDoctors",
      page,
      limit,
      query,
      specialization,
      availability,
    ],
    queryFn: () => getAllDoctors(searchParams, accessToken),
  });
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });
  const doctors = data?.data?.data?.doctors || [];

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Doctors</h1>
          <p className="text-gray-500">Manage your doctors</p>
        </div>
      </div>
      <div className="mt-8 space-y-6">
        <div className="flex justify-end items-center">
          <Search id="search-doctors">
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
                {doctors?.length > 0 ? (
                  <>
                    <Suspense fallback={<SkeletonTable />}>
                      <Table doctors={doctors} />
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
                    No doctors found
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
