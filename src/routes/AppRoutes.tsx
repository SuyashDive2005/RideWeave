import { Routes, Route } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import AuthCallback from "@/pages/auth/AuthCallback";
import Rides from "@/pages/rides/Rides";
import Profile from "@/pages/profile/Profile";
import WalletPage from "@/pages/wallet/Wallet";
import Settings from "@/pages/settings/Settings";
import Support from "@/pages/support/Support";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <PageLayout>
            <Home />
          </PageLayout>
        }
        path="/"
      />
      <Route element={<Login />} path="/login" />
      <Route element={<AuthCallback />} path="/auth/callback" />
      <Route
        element={
          <PageLayout>
            <Rides />
          </PageLayout>
        }
        path="/rides"
      />
      <Route
        element={
          <PageLayout>
            <ProtectedRoute element={<Profile />} />
          </PageLayout>
        }
        path="/profile"
      />
      <Route
        element={
          <PageLayout>
            <ProtectedRoute element={<WalletPage />} />
          </PageLayout>
        }
        path="/wallet"
      />
      <Route
        element={
          <PageLayout>
            <ProtectedRoute element={<Settings />} />
          </PageLayout>
        }
        path="/settings"
      />
      <Route
        element={
          <PageLayout>
            <ProtectedRoute element={<Support />} />
          </PageLayout>
        }
        path="/support"
      />
    </Routes>
  );
}
