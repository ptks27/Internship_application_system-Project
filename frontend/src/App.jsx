import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import History from "./components/History";
import SearchResult from "./components/SearchResult";
import Profile from "./components/Profile";
import JobDetails from "./components/JobDetails";
import CompaniesAgent from "./components/admin/CompaniesAgent";
import JobsAgent from "./components/admin/JobsAgent";
import CompanyNew from "./components/admin/CompanyNew";
import CompanySetup from "./components/admin/CompanySetup";
import PostJobs from "./components/admin/PostJobs";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import UpdateJobs from "./components/admin/UpdateJobs";
import UpdateCompany from "./components/admin/UpdateCompany";
import NotFound from "./components/NotFound";
import VerifyEmail from "./components/auth/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ResetPasswordSuccess from "./components/auth/ResetPasswordSuccess";
import ForgotPasswordSuccess from "./components/auth/ForgotPasswordSuccess";
import EnterOTP from "./components/auth/EnterOTP";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/search",
    element: <SearchResult />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/details/:id",
    element: <JobDetails />,
  },

  //admin routes
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <CompaniesAgent />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/companies/new",
    element: (
      <ProtectedRoute>
        <CompanyNew />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <JobsAgent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/new",
    element: (
      <ProtectedRoute>
        <PostJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id",
    element: (
      <ProtectedRoute>
        <UpdateJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/update/:id",
    element: (
      <ProtectedRoute>
        <UpdateCompany />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/reset-password-success",
    element: <ResetPasswordSuccess />,
  },
  {
    path: "/forgot-password-success",
    element: <ForgotPasswordSuccess />,
  },
  {
    path: "/enter-otp",
    element: <EnterOTP />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
