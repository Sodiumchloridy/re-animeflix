import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("re-animeflix");

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
