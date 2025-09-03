import Patient from "../models/patient.js";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import Inpatient from "../models/inpatient.js";
import Payment from "../models/payment.js";
import Appointment from "../models/appointment.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const buildAppointmentSummary = (appointments = []) => {
  const total = appointments.length || 0;
  const counts = appointments.reduce(
    (acc, { status }) => {
      if (status === "scheduled") acc.scheduled += 1;
      else if (status === "confirmed") acc.confirmed += 1;
      else if (status === "cancelled") acc.cancelled += 1;
      return acc;
    },
    { scheduled: 0, confirmed: 0, cancelled: 0 }
  );
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  return {
    counts,
    percentages: {
      scheduled: pct(counts.scheduled),
      confirmed: pct(counts.confirmed),
      cancelled: pct(counts.cancelled),
    },
    total,
  };
};

const buildPaymentSummary = (payments = []) => {
  const total = payments.length || 0;
  const counts = payments.reduce(
    (acc, { status }) => {
      if (status === "pending") acc.pending += 1;
      else if (status === "confirmed") acc.confirmed += 1;
      else if (status === "cancelled") acc.cancelled += 1;
      return acc;
    },
    { pending: 0, confirmed: 0, cancelled: 0 }
  );
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  return {
    counts,
    percentages: {
      pending: pct(counts.pending),
      confirmed: pct(counts.confirmed),
      cancelled: pct(counts.cancelled),
    },
    total,
  };
};

const dashboardService = {
  getPatientStats: async (userId, next) => {
    const [appointments, payments, pendingPayments, allPayments] =
      await Promise.all([
        Appointment.find({ patientId: userId.toString() })
          .populate("doctorId", "fullname")
          .populate("patientId", "fullname email phone"),
        Payment.find({ patientId: userId.toString() }).limit(5),
        Payment.find({ status: "pending" }).limit(5),
        Payment.find({ patientId: userId.toString() }),
      ]);
    const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
    // Get appointments within the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.createdAt);
      return appointmentDate >= sevenDaysAgo;
    });
    const recentPayments = payments.filter((appointment) => {
      const paymentDate = new Date(appointment.createdAt);
      return paymentDate >= sevenDaysAgo;
    });
    const appointmentSummary = buildAppointmentSummary(appointments);
    const paymentSummary = buildAppointmentSummary(allPayments);

    return {
      appointments,
      payments,
      appointmentCount: appointments.length,
      paymentCount: payments.length,
      totalPayments,
      recentAppointments: recentAppointments,
      recentAppointmentCount: recentAppointments.length,
      pendingPayments,
      recentPayments,
      appointmentSummary,
      paymentSummary,
    };
  },
  getAllStats: async (next) => {
    const [appointments, payments, pendingPayments, allPayments] =
      await Promise.all([
        Appointment.find()
          .populate("doctorId", "fullname")
          .populate("patientId", "fullname email phone"),
        Payment.find({ status: "confirmed" }),
        Payment.find({ status: "pending" }).limit(5),
        Payment.find(),
      ]);
    const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
    // Get appointments within the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.createdAt);
      return appointmentDate >= sevenDaysAgo;
    });

    const recentPayments = payments.filter((appointment) => {
      const paymentDate = new Date(appointment.createdAt);
      return paymentDate >= sevenDaysAgo;
    });

    const appointmentSummary = buildAppointmentSummary(appointments);
    const paymentSummary = buildAppointmentSummary(allPayments);

    return {
      appointments,
      payments,
      appointmentCount: appointments.length,
      paymentCount: payments.length,
      totalPayments,
      recentAppointments: recentAppointments,
      recentAppointmentCount: recentAppointments.length,
      pendingPayments,
      recentPayments,
      appointmentSummary,
      paymentSummary,
    };
  },
};

export default dashboardService;
