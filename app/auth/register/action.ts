import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const handleSubmit = async (prevState: any, formData: { get: (arg0: string) => any; }) => {
  const username = formData.get("username");
  const password = formData.get("password");

  const hashedPassword = await bcrypt.hash(password, 12);

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password: hashedPassword,
    }),
  });

  if (res.ok) {
    redirect("/auth/login");
  } else {
    const { message } = await res.json();
    return { message: message };
  }
};