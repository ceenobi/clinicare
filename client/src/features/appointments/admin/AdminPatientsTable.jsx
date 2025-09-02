import TableBody from "@/components/TableBody";
import {
  appointmentsStatusColors,
  appointmentsTableColumns,
  formatDate,
} from "@/utils/constants";
import { useCallback } from "react";
import EditPatientsAppointment from "./EditPatientsAppointment";
import Feedback from "./Feedback";

export default function AdminPatientsTable({ appointments }) {
  const renderCell = useCallback((appointment, columnKey) => {
    const cellValue = appointment[columnKey];
    switch (columnKey) {
      case "appointmentId":
        return <div>{appointment?._id}</div>;
      case "patientName":
        return (
          <>
            <h1 className="font-bold">{appointment?.patientId?.fullname}</h1>
            <p className="">{appointment?.patientId?.email}</p>
          </>
        );
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
            <EditPatientsAppointment appointment={appointment} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={appointmentsTableColumns}
        tableData={appointments}
        renderCell={renderCell}
      />
    </>
  );
}
