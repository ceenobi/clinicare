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
      // {
      //   id: "patient-appointments",
      //   name: "Appointments",
      //   href: "/dashboard/patient-appointments",
      //   Icon: RiCalendarLine,
      // },
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
      // {
      //   id: "patient-payments",
      //   name: "Payments",
      //   href: "/dashboard/patient-payments",
      //   Icon: RiBankCardLine,
      // },
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