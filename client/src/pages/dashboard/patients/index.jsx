import { getAllPatients } from "@/api/patients";
import ErrorAlert from "@/components/ErrorAlert";
import { LazyLoader } from "@/components/LazyLoader";
import PageWrapper from "@/components/PageWrapper";
import Paginate from "@/components/paginate";
import usePaginate from "@/hooks/usePaginate";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function Patients() {
  const { accessToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getPatients", searchParams],
    queryFn: () => getAllPatients(searchParams, accessToken),
  });

  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: data?.data?.meta?.totalPages || 1,
      hasMore: data?.data?.meta?.hasMore || false,
      currentPage: data?.data?.meta?.currentPage || 1,
    });

  console.log(data);
  console.log(searchParams.get("page"));

  if (isPending) {
    return <LazyLoader />;
  }

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Patients</h1>
          <p className="text-gray-500">Manage your patients</p>
        </div>
        {/* <AddPatient /> */}
      </div>
      {isError && <ErrorAlert error={error?.response?.data?.message} />}
      <Paginate
        totalPages={totalPages}
        hasMore={hasMore}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        limit={limit}
      />
      <button onClick={() => setSearchParams({page: "3"})}>prev</button>
      <button>next</button>
    </PageWrapper>
  );
}
