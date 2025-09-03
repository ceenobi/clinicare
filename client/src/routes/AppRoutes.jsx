import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazyLoader } from "@/components/LazyLoader";
import { PublicRoutes, PrivateRoutes, VerifiedRoutes } from "./ProtectedRoutes";
import { useAuth } from "@/store";
import ErrorBoundary from "@/components/ErrorBoundary";

//render pages
const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const OnboardLayout = lazy(() => import("@/layouts/OnboardLayout"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const Home = lazy(() => import("@/pages/home/Home"));
const Contact = lazy(() => import("@/pages/contact"));
const Signin = lazy(() => import("@/pages/account/signin"));
const Signup = lazy(() => import("@/pages/account/signup"));
const VerifyAccount = lazy(() => import("@/pages/verifyAccount"));
const PatientOnboard = lazy(() => import("@/pages/patientsOnboard"));
const ForgotPassword = lazy(() => import("@/pages/account/forgotPassword"));
const ResetPassword = lazy(() => import("@/pages/account/resetPassword"));
const Patients = lazy(() => import("@/pages/dashboard/patients"));
const Settings = lazy(() => import("@/pages/dashboard/settings"));
const Account = lazy(() => import("@/pages/dashboard/settings/account"));
const Password = lazy(() => import("@/pages/dashboard/settings/password"));
const Health = lazy(() => import("@/pages/dashboard/settings/health"));
const Users = lazy(() => import("@/pages/dashboard/users"));
const Doctors = lazy(() => import("@/pages/dashboard/doctors"));
const Rooms = lazy(() => import("@/pages/dashboard/rooms"));
const PatientsAppointment = lazy(() =>
  import("@/pages/dashboard/appointments/PatientsAppointment")
);
const Appointments = lazy(() => import("@/pages/dashboard/appointments"));
const Payments = lazy(() => import("@/pages/dashboard/payments"));
const PatientPayments = lazy(() =>
  import("@/pages/dashboard/payments/PatientPayments")
);
const Inpatients = lazy(() => import("@/pages/dashboard/inpatients"));
const Dashboard = lazy(() => import("@/pages/dashboard"));

export default function AppRoutes() {
  const { accessToken, user } = useAuth();
  const routes = [
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <RootLayout />
          </PublicRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Contact />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "account",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "signin",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Signin />
            </Suspense>
          ),
        },
        {
          path: "signup",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Signup />
            </Suspense>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ForgotPassword />
            </Suspense>
          ),
        },
        {
          path: "reset-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ResetPassword />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <VerifiedRoutes accessToken={accessToken} user={user}>
            <OnboardLayout />
          </VerifiedRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "verify-account",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <VerifyAccount />
            </Suspense>
          ),
        },
        {
          path: "patients-onboard",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientOnboard />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <DashboardLayout />,
          </PrivateRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "settings",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Settings />
            </Suspense>
          ),
          children: [
            {
              path: "account",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Account />
                </Suspense>
              ),
            },
            {
              path: "password",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Password />
                </Suspense>
              ),
            },
            {
              path: "health",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Health />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "patients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Patients />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Users />
            </Suspense>
          ),
        },
        {
          path: "doctors",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Doctors />
            </Suspense>
          ),
        },
        {
          path: "rooms",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Rooms />
            </Suspense>
          ),
        },
        {
          path: "patient-appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientsAppointment />
            </Suspense>
          ),
        },
        {
          path: "appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Appointments />
            </Suspense>
          ),
        },
        {
          path: "payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Payments />
            </Suspense>
          ),
        },
        {
          path: "patient-payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientPayments />
            </Suspense>
          ),
        },
        {
          path: "inpatients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Inpatients />
            </Suspense>
          ),
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
