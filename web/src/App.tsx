import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "@pages/LandingPage";
import AppHome from "@pages/AppHome";
import SpacePage from "@pages/SpacePage";
import { NavBar } from "@components/common/NavBar";
import { ProtectedRoute } from "@components/common/ProtectedRoute";
import { PageTransition } from "@components/common/PageTransition";

export default function App() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <AppHome />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/space/:spaceId"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <SpacePage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

