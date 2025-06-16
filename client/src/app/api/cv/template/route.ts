import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cvId, templateId } = body;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cv/template`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cvId, templateId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to set template");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error setting template:", error);
    return NextResponse.json(
      { message: "Failed to set template" },
      { status: 500 }
    );
  }
}
