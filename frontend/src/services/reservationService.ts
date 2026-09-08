import api from "./api";

export interface Reservation {
  id: number;
  date: string;
  time: string;
  numberOfPeople: number;
  status: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  table?: {
    id: number;
    number: number;
    capacity: number;
  };
}

export const getAllReservations = async (): Promise<Reservation[]> => {
  const response = await api.get("/reservations");
  return response.data;
};