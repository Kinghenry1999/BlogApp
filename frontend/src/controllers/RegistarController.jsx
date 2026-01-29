export async function handleAdminRegister(formData) {
  try {
    const response = await fetch("http://localhost:5000/api/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.log("Error:", error.message);
  }
}
