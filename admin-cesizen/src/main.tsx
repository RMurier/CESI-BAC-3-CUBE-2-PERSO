import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home.tsx";
import AppBar from "./components/Appbar.tsx";
import LoginPage from "./pages/login.tsx";
import UsersPage from "./pages/user.tsx";
import EmotionsPage from "./pages/emotion.tsx";
import ExerciceRespirationPage from "./pages/respiration.tsx";
import ListeInformations from "./pages/informations.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <AppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/emotions" element={<EmotionsPage />} />
          <Route path="/respiration" element={<ExerciceRespirationPage />} />
          <Route path="/informations" element={<ListeInformations />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
