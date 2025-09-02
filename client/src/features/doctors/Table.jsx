import { useCallback } from "react";
import { doctorsTableColumns, doctorsStatusColors } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import EditDoctor from "./EditDoctor";

export default function Table({ doctors }) {
  const renderCell = useCallback((doctor, columnKey) => {
    const cellValue = doctor[columnKey];
    switch (columnKey) {
      case "fullname":
        return (
          <>
            <h1 className="font-bold">{doctor?.userId?.fullname}</h1>
            {doctor?.userId?.email}
          </>
        );
      case "phone":
        return <div className="capitalize">{doctor?.phone || "N/A"}</div>;
      case "availability":
        return (
          <div
            className={`capitalize badge font-semibold ${
              doctorsStatusColors[doctor.availability]
            }`}
          >
            {doctor.availability}
          </div>
        );
      case "action":
        return (
          <div className="flex items-center ">
            <EditDoctor doctor={doctor} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <TableBody
        tableColumns={doctorsTableColumns}
        tableData={doctors}
        renderCell={renderCell}
      />
    </>
  );
}
