import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "d1c07051cbe0d553f582115420007b84";

// ✅ Helper to extract user from token
function getUserFromRequest(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  const parts = auth.split(" ");
  if (parts.length !== 2) return null;

  const token = parts[1];

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// ✅ GET — List all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ POST — Create a new blog (auth required)
export async function POST(request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        author: { connect: { id: user.userId } }
      },
      include: {
        author: { select: { id: true, email: true } }
      }
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (err) {
    console.error("POST /api/blogs error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
