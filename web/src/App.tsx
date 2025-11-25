import { Route, Routes } from "react-router-dom";
import LandingPage from "@pages/LandingPage";
import AppHome from "@pages/AppHome";
import SpacePage from "@pages/SpacePage";
import { NavBar } from "@components/common/NavBar";
import { ProtectedRoute } from "@components/common/ProtectedRoute";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/space/:spaceId"
          element={
            <ProtectedRoute>
              <SpacePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}

