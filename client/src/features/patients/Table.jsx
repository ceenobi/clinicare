import { useCallback } from "react";
import { formatDate, patientsTableColumns } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { RiMailFill, RiPhoneLine } from "@remixicon/react";

export default function Table({ patients }) {
  const renderCell = useCallback((patient, columnKey) => {
    const cellValue = patient[columnKey];
    switch (columnKey) {
      case "fullname":
        return (
          <>
            <h1 className="font-bold">{patient?.fullname}</h1>
            {patient?.email}
          </>
        );
      case "gender":
        return <div className="capitalize">{patient?.gender}</div>;
      case "dateOfBirth":
        return (
          <div className="capitalize">{formatDate(patient?.dateofBirth)}</div>
        );
      case "action":
        return (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => window.open(`mailto:${patient.email}`, "_blank")}
              title="send a mail"
              className="cursor pointer"
            >
              <RiMailFill className="text-blue-500"/>
            </button>
            <button
              onClick={() =>
                window.open(`tel:${patient.phoneNumber}`, "_blank")
              }
              title={`call ${patient?.fullname}`}
              className="cursor pointer"
            >
              <RiPhoneLine className="text-blue-500"/>
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <TableBody
        tableColumns={patientsTableColumns}
        tableData={patients}
        renderCell={renderCell}
      />
    </>
  );
}
