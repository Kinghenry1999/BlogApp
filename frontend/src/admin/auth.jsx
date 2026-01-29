export const isAdmin = () => {
  // TEMPORARY: simulate admin access
  return localStorage.getItem("role") === "admin";
};
