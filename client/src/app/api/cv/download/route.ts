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
      `${process.env.NEXT_PUBLIC_API_URL}/api/cv/download`,
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
      throw new Error("Failed to download CV");
    }

    const pdfBuffer = await response.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv.pdf"',
      },
    });
  } catch (error) {
    console.error("Error downloading CV:", error);
    return NextResponse.json(
      { message: "Failed to download CV" },
      { status: 500 }
    );
  }
}
