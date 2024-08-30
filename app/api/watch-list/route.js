import client from "../../../lib/mongodb";
import { cookies } from 'next/headers'
import { verifyToken } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = client.db("re-animeflix");
    const usersCollection = db.collection("users");

    const cookieStore = cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { message: "Login/Authorization token required" },
        { status: 401 }
      );
    }
    
    // return NextResponse.json({ message: token }, { status: 200 });
    const {username} = verifyToken(token.value);
    // return NextResponse.json({ message: username }, { status: 200 });


    const user = await usersCollection.findOne(
      {username: username},
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ watchList: user.animes }, { status: 200 });
    
  } catch (error) {
    console.error("Failed to retrieve watch list:", error);
    return NextResponse.json(
      { message: "Failed to retrieve watch list" },
      { status: 500 }
    );
  }
}
