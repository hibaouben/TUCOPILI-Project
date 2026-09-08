import api from "./api";

export interface ReviewPayload {
  rating: number;
  comment: string;
  userId: number;
}

export interface ReviewFromBackend {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export async function getReviews(): Promise<ReviewFromBackend[]> {
  const response = await api.get("/reviews");
  return response.data;
}

export async function createReview(
  payload: ReviewPayload
): Promise<ReviewFromBackend> {
  const response = await api.post("/reviews", payload);
  return response.data;
}