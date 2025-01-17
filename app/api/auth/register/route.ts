import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Register user");
    const { username, password } = await request.json();
    console.log("Username" + username);
    console.log("Password " + password);
    const client = await clientPromise;
    console.log("Client" + client);
    const db = client.db("re-animeflix");
    console.log(db);
    const existingUser = await db.collection("users").findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    await db.collection("users").insertOne({
      username,
      password,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Failed to register user:", error);
    return NextResponse.json({ message: "Failed to register" }, { status: 500 });
  }
}
