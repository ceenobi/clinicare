import TableBody from "@/components/TableBody";
import {
  appointmentsStatusColors,
  patientsAppointmentsTableColumns,
  formatDate,
} from "@/utils/constants";
import { useCallback } from "react";
import EditAppointment from "./EditAppointment";
import Feedback from "./Feedback";

export default function PatientsTable({ appointments }) {
  const renderCell = useCallback((appointment, columnKey) => {
    const cellValue = appointment[columnKey];
    switch (columnKey) {
      case "appointmentId":
        return <div className="text-sm">{appointment?._id}</div>;
      case "doctor":
        return (
          <div className="capitalize font-semibold">
            {appointment?.doctorId?.fullname
              ? `Dr. ${appointment?.doctorId?.fullname}`
              : "Not Assigned"}
          </div>
        );
      case "appointmentDate":
        return <div>{formatDate(appointment?.appointmentDate)}</div>;
      case "status":
        return (
          <div
            className={`capitalize badge font-semibold ${
              appointmentsStatusColors[appointment.status]
            }`}
          >
            {appointment.status}
          </div>
        );
      case "action":
        return (
          <div className="flex items-center gap-4">
            <Feedback appointment={appointment} />
            <EditAppointment appointment={appointment} />
          </div>
        );

      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={patientsAppointmentsTableColumns}
        tableData={appointments}
        renderCell={renderCell}
      />
    </>
  );
}
