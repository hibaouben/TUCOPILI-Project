import api from "./api";

export interface AppUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  position: "CUISINIER" | "CAISSIER" | null;
  createdAt: string;
}

export const getAllUsers = async (): Promise<AppUser[]> => {
  const response = await api.get("/users");
  return response.data;
};

export interface EmployeeStats {
  id: number;
  firstName: string;
  lastName: string;
  position: "CUISINIER" | "CAISSIER" | null;
  ordersHandled: number;
  shifts: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export const getEmployeesStats = async (): Promise<EmployeeStats[]> => {
  const response = await api.get("/users/employees/stats");
  return response.data;
};

/* =========================
   AJOUTER UN EMPLOYÉ
========================= */

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  position: "CUISINIER" | "CAISSIER";
}

export const createEmployee = async (
  data: CreateEmployeeData
): Promise<AppUser> => {
  const response = await api.post("/users/employees", data);

  return response.data;
};