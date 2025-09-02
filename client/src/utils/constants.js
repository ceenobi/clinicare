import {
  RiBankCardLine,
  RiBuildingLine,
  RiCalendarLine,
  RiDashboardLine,
  RiGroup3Line,
  RiGroupLine,
  RiHeartPulseLine,
  RiHotelBedLine,
  RiPulseLine,
  RiSettingsLine,
  RiShieldLine,
  RiStethoscopeLine,
  RiUserLine,
} from "@remixicon/react";
import dayjs from "dayjs";

export const portalLogin = [
  {
    id: 1,
    title: "Admin Portal",
    info: "Secure access for administrator to manage hospital resources.",
    href: "admin",
    Icon: RiUserLine,
    color: "bg-blue-100 text-blue-400",
  },
  {
    id: 2,
    title: "Doctor Portal",
    info: "Secure access for doctors to manage patients, appointments, diagnosis stc.",
    href: "doctor",
    Icon: RiGroupLine,
    color: "bg-green-100 text-green-400",
  },
  {
    id: 3,
    title: "Nurses Portal",
    info: "Secure access for nurses to manage patient care, schedules, and vital signs..",
    href: "nurse",
    Icon: RiGroupLine,
    color: "bg-yellow-100 text-yellow-400",
  },
  {
    id: 4,
    title: "Patient Portal",
    info: "Easy access for patients to view appointments, medical records, and more.",
    href: "patient",
    Icon: RiHeartPulseLine,
    color: "bg-red-100 text-red-400",
  },
];

export const enterpriseFeatures = [
  {
    id: 1,
    title: "Hospital Operations",
    info: "Streamline daily operations, resource allocation, and staff management.",
    Icon: RiBuildingLine,
  },
  {
    id: 2,
    title: "Data Security",
    info: "HIPAA-compliant security measures to protect sensitive patient data.",
    Icon: RiShieldLine,
  },
  {
    id: 3,
    title: "Clinical Management",
    info: "Comprehensive tools for patient care and clinical workflow optimization.",
    Icon: RiPulseLine,
  },
];

export const clinicareStats = [
  {
    id: 1,
    title: "100+",
    subtitle: "Hospitals",
  },
  {
    id: 2,
    title: "1000+",
    subtitle: "Healthcare Professionals",
  },
  {
    id: 3,
    title: "1M+",
    subtitle: "Patients Served",
  },
  {
    id: 4,
    title: "99.9%",
    subtitle: "System Uptime",
  },
];

export const bloodGroup = {
  "A+": "A-positive",
  "A-": "A-negative",
  "B+": "B-positive",
  "B-": "B-negative",
  "AB+": "AB-positive",
  "AB-": "AB-negative",
  "O+": "O-positive",
  "O-": "O-negative",
};

export const dashBoardLinks = [
  {
    id: "menu",
    title: "Menu",
    children: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        Icon: RiDashboardLine,
      },
      {
        id: "appointments",
        name: "Appointments",
        href: "/dashboard/appointments",
        Icon: RiCalendarLine,
      },
      {
        id: "patient-appointments",
        name: "Appointments",
        href: "/dashboard/patient-appointments",
        Icon: RiCalendarLine,
      },
      {
        id: "rooms",
        name: "Rooms",
        href: "/dashboard/rooms",
        Icon: RiHotelBedLine,
      },
      {
        id: "payments",
        name: "Payments",
        href: "/dashboard/payments",
        Icon: RiBankCardLine,
      },
      {
        id: "patient-payments",
        name: "Payments",
        href: "/dashboard/patient-payments",
        Icon: RiBankCardLine,
      },
    ],
  },
  {
    id: "management",
    title: "Management",
    children: [
      {
        id: "doctors",
        name: "Doctors",
        href: "/dashboard/doctors",
        Icon: RiStethoscopeLine,
      },
      {
        id: "patients",
        name: "Patients",
        href: "/dashboard/patients",
        Icon: RiGroupLine,
      },
      {
        id: "inpatients",
        name: "Inpatients",
        href: "/dashboard/inpatients",
        Icon: RiGroup3Line,
      },
    ],
  },
  {
    id: "setting",
    title: "Setting",
    children: [
      {
        id: "users",
        name: "Users",
        href: `/dashboard/users`,
        Icon: RiUserLine,
      },
      {
        id: "setting",
        name: "Setting",
        href: "/dashboard/settings",
        Icon: RiSettingsLine,
      },
    ],
  },
];

export const headers = (accessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const formatDate = (item, format = "display") => {
  if (format === "input") {
    return dayjs(item).format("YYYY-MM-DD");
  }
  return dayjs(item).format("DD/MM/YYYY");
};

export const settingsLink = [
  {
    id: "account",
    href: "/dashboard/settings/account",
    name: "Account",
  },
  {
    id: "password",
    href: "/dashboard/settings/password",
    name: "Password",
  },
  {
    id: "health",
    href: "/dashboard/settings/health",
    name: "Health Record",
  },
];

export const usersRoleColors = {
  admin: "bg-blue-200 text-blue-700",
  doctor: "bg-green-200 text-green-700",
  nurse: "bg-yellow-200 text-yellow-700",
  staff: "bg-teal-200 text-teal-700",
  patient: "bg-red-200 text-red-700",
};

export const roleBasedPathPermissions = {
  admin: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/payments",
      "/dashboard/doctors",
      "/dashboard/patients",
      "/dashboard/inpatients",
      "/dashboard/users",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  doctor: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/doctors",
      "/dashboard/patients",
      "/dashboard/inpatients",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  patient: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/patient-appointments",
      "/dashboard/patient-payments",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
      "/dashboard/settings/health",
    ],
  },
  nurse: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  staff: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
};

export const patientsTableColumns = [
  { name: "NAME", uid: "fullname" },
  { name: "GENDER", uid: "gender" },
  { name: "DATE OF BIRTH", uid: "dateOfBirth" },
  { name: "ADDRESS", uid: "address" },
  { name: "BLOOD GROUP", uid: "bloodGroup" },
  { name: "PHONE", uid: "phone" },
  { name: "ACTION", uid: "action" },
];

export const roomsTableColumns = [
  { name: "ROOM NUMBER", uid: "roomNumber" },
  { name: "ROOM TYPE", uid: "roomType" },
  { name: "ROOM CAPACITY", uid: "roomCapacity" },
  { name: "ROOM PRICE", uid: "roomPrice" },
  { name: "ROOM STATUS", uid: "roomStatus" },
  { name: "IS FILLED", uid: "isFilled" },
  { name: "ACTION", uid: "action" },
];

export const roomsStatusColors = {
  available: "bg-green-200 text-green-700",
  occupied: "bg-yellow-200 text-yellow-700",
  maintenance: "bg-red-200 text-red-700",
};

export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
  }).format(amount);
};

export const availability = ["available", "unavailable", "on leave", "sick"];
export const specialization = [
  "Cardiology",
  "Dermatology",
  "Gastroenterology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Urology",
];

export const doctorsTableColumns = [
  { name: "DOCTOR", uid: "fullname" },
  { name: "PHONE", uid: "phone" },
  { name: "SPECIALIZATION", uid: "specialization" },
  { name: "STATUS", uid: "availability" },
  { name: "ACTION", uid: "action" },
];

export const doctorsStatusColors = {
  available: "bg-green-200 text-green-700",
  unavailable: "bg-blue-200 text-blue-700",
  "on leave": "bg-yellow-200 text-yellow-700",
  sick: "bg-red-200 text-red-700",
};

export const patientsAppointmentsTableColumns = [
  { name: "APPOINTMENT ID", uid: "appointmentId" },
  { name: "DATE", uid: "appointmentDate" },
  { name: "DOCTOR", uid: "doctor" },
  { name: "TIME", uid: "appointmentTime" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const appointmentsStatusColors = {
  scheduled: "bg-yellow-200 text-yellow-700",
  confirmed: "bg-green-200 text-green-700",
  cancelled: "bg-red-200 text-red-700",
};

export const appointmentsTableColumns = [
  { name: "APPOINTMENT ID", uid: "appointmentId" },
  { name: "PATIENT", uid: "patientName" },
  { name: "DOCTOR", uid: "doctor" },
  { name: "DATE", uid: "appointmentDate" },
  { name: "TIME", uid: "appointmentTime" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const paymentsTableColumns = [
  { name: "PATIENT", uid: "patientName" },
  { name: "PAYMENT ID", uid: "paymentId" },
  { name: "PAYMENT TYPE", uid: "paymentType" },
  { name: "AMOUNT", uid: "amount" },
  { name: "STATUS", uid: "status" },
  { name: "PAID AT", uid: "paidAt" },
  { name: "ACTION", uid: "action" },
];

export const paymentStatusColors = {
  pending: "bg-yellow-200 text-yellow-700",
  confirmed: "bg-green-200 text-green-700",
  cancelled: "bg-red-200 text-red-700",
};

export const inpatientsTableColumns = [
  { name: "PATIENT", uid: "patientName" },
  { name: "DOCTOR", uid: "doctorName" },
  { name: "ROOM", uid: "room" },
  { name: "ADMISSION DATE", uid: "admissionDate" },
  { name: "DISCHARGE DATE", uid: "dischargeDate" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const inpatientStatusColors = {
  admitted: "bg-green-200 text-green-700",
  discharged: "bg-red-200 text-red-700",
  transferred: "bg-yellow-200 text-yellow-700",
};
