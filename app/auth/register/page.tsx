"use client";

import { useState } from "react";
import { handleSubmit } from "./action";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

const initialState = {
  message: "",
};

function FormContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { pending } = useFormStatus();
  return (
    <>
      <input
        type="text"
        placeholder="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-black"
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md text-black"
      />
      <p className="text-sm text-gray-500">Do not use your personal passwords.</p>
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        {pending ? "Loading..." : "Register"}
      </button>
    </>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(handleSubmit, initialState);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {state?.message && <p className="text-red-500 mb-4">{state?.message}</p>}
      <form
        action={formAction}
        className="flex flex-col space-y-4"
      >
        <FormContent />
      </form>
    </div>
  );
}
