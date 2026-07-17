import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function login(email, password) {
  const form = new URLSearchParams();

  form.append("username", email);
  form.append("password", password);

  const response = await API.post(
    "/auth/login",
    form,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}