import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch(`http://localhost:3001/api/templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }

    const result = await response.json();

    const templates = result.data.map((template: any) => ({
      id: template._id,
      name: template.name,
      description: template.description,
      category: template.metadata?.category || "professional",
      thumbnail: template.preview?.thumbnail || "/default-thumbnail.jpg",
      preview:
        template.preview?.previewImages?.[0] ||
        template.preview?.thumbnail ||
        "/default-preview.jpg",
      isPremium: template.isPremium,
    }));

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
