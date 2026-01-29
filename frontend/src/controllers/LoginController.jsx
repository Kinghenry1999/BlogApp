export const loginAdmin = async (email, password) => {
  const response = await fetch("http://localhost:5000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return { ok: response.ok, data };
};
