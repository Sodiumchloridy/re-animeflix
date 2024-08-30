import { verifyPassword, generateToken } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import client from "../../../../lib/mongodb";
import { cookies } from 'next/headers'

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

    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    // Set the token in a cookie maxAge is in seconds
    cookies().set({
      
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 3600,
    })

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to log in:", error);
    return NextResponse.json({ message: "Failed to log in" }, { status: 500 });
  }
}
