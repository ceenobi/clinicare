import { getPatientAppointments } from "@/api/appointments";
import { SkeletonTable } from "@/components/LazyLoader";
import PageWrapper from "@/components/PageWrapper";
import Search from "@/components/Search";
import BookAppointment from "@/features/appointments/patients/BookAppointment";
import Filter from "@/features/appointments/Filter";
import usePaginate from "@/hooks/usePaginate";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router";
import ErrorAlert from "@/components/ErrorAlert";
import Paginate from "@/components/Paginate";
const Table = lazy(() =>
  import("@/features/appointments/patients/PatientsTable")
);
//ll
export default function PatientsAppointment() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const time = searchParams.get("time") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: [
      "getPatientAppointments",
      page,
      limit,
      query,
      time,
      status,
      startDate,
      endDate,
    ],
    queryFn: () => getPatientAppointments(searchParams, accessToken),
  });
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

  const appointments = data?.data?.data?.appointments || [];

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Appointments</h1>
          <p className="text-gray-500">Manage your appointments</p>
        </div>
        <BookAppointment />
      </div>
      <div className="mt-8 space-y-6">
        <div className="flex justify-end items-center">
          <Search id="search-patientAppointments">
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
                <Suspense fallback={<SkeletonTable />}>
                  <Table appointments={appointments} />
                </Suspense>
                <Paginate
                  totalPages={totalPages}
                  hasMore={hasMore}
                  handlePageChange={handlePageChange}
                  currentPage={currentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
