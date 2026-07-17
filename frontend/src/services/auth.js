import api from "../api/api";

export async function login(email, password) {
  const formData = new FormData();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function register(userData) {
  const response = await api.post(
    "/users",
    userData
  );

  return response.data;
}