export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ServiceDto {
  id: string;
  name: string;
  description: string;
  duration_min: number;
  price: number;
  price_note: string | null;
  features: string[];
  highlight: boolean;
  active: boolean;
}

export type AppointmentStatus = "pending" | "confirmed" | "refused";

export interface AppointmentDto {
  id: string;
  service_id: string;
  service_name: string;
  date: string;
  time: string;
  client_name: string;
  phone: string;
  address: string;
  email: string | null;
  message: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface BookingSettings {
  open_days: number[];
  start_time: string;
  end_time: string;
  gap_minutes: number;
  max_per_day: number;
}

export interface ProfileDto {
  display_name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  zone: string;
  photo_path: string | null;
}

export interface ClientDto {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string | null;
  notes: string;
  appointments_count: number;
  created_at: string;
}

export interface AvailabilityDto {
  slots: string[];
  closed: boolean;
  full?: boolean;
  reason?: "weekly" | "vacation" | "full" | null;
}

export interface BlockedPeriod {
  id: string;
  start_date: string;
  end_date: string;
  label: string;
}

export const formatPrice = (price: number, note?: string | null): string =>
  price > 0 ? `${price} €` : (note ?? "Sur devis");

export const formatDuration = (minutes: number): string =>
  minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60}` : ""}` : `${minutes} min`;
