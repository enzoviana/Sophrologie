import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/lib/auth";
import { EditModeProvider } from "@/lib/editMode";
import PublicLayout from "@/components/landing/PublicLayout";
import Home from "@/pages/Home";
import PrestationsPage from "@/pages/PrestationsPage";
import PrestationDetailPage from "@/pages/PrestationDetailPage";
import AboutPage from "@/pages/AboutPage";
import BookingPage from "@/pages/BookingPage";
import ContactPage from "@/pages/ContactPage";
import AstroSophroPage from "@/pages/AstroSophroPage";
import NotFoundPage from "@/pages/NotFoundPage";
import MentionsLegalesPage from "@/pages/MentionsLegalesPage";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AppointmentsPage from "@/pages/admin/AppointmentsPage";
import CalendarPage from "@/pages/admin/CalendarPage";
import ClientsPage from "@/pages/admin/ClientsPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import ContentPage from "@/pages/admin/ContentPage";
import TestimonialsPage from "@/pages/admin/TestimonialsPage";
import FaqPage from "@/pages/admin/FaqPage";
import SettingsPage from "@/pages/admin/SettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <EditModeProvider>
        <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<PrestationsPage />} />
          <Route path="/prestations/:id" element={<PrestationDetailPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/rendez-vous" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/astro-sophrologie" element={<AstroSophroPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="rendez-vous" element={<AppointmentsPage />} />
          <Route path="calendrier" element={<CalendarPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contenu" element={<ContentPage />} />
          <Route path="temoignages" element={<TestimonialsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="parametres" element={<SettingsPage />} />
        </Route>
      </Routes>
      </EditModeProvider>
    </AuthProvider>
  );
}
