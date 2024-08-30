"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 1500); // Redirect to login after 1.5 seconds
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-white">
      <h2>Register</h2>
      {error && <p>{error}</p>}
      {success && <p>Registration successful! Redirecting to login...</p>}
      {!success && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="text-black"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-black"
            />
          </div>
          <button type="submit" className="bg-red-600">Register</button>
        </form>
      )}
    </div>
  );
}
