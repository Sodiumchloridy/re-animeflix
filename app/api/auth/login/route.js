import { verifyPassword, generateToken } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
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

    // Set the token in a Set-Cookie header with SameSite attribute
    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`);

    return response;

  } catch (error) {
    console.error("Failed to log in:", error);
    return NextResponse.json({ message: "Failed to log in" }, { status: 500 });
  }
}
