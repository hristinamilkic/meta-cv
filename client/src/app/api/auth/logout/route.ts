import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the token cookie
    (await cookies()).delete("token");

    return new NextResponse("Logged out successfully");
  } catch (error) {
    console.error("Error during logout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
