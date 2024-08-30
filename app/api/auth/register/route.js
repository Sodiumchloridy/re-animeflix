import client from "../../../../lib/mongodb";
import { hashPassword } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const db = client.db("re-animeflix");
    const usersCollection = db.collection("users");

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password and save the user
    const hashedPassword = await hashPassword(password);
    const newUser = await usersCollection.insertOne({
      username: username,
      password: hashedPassword,
      animes: [],
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.insertedId },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Failed to register user:", error);
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}
