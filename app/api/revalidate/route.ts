import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    revalidatePath(`/${slug}`);
    return NextResponse.json({ revalidated: true, path: `/${slug}`, now: Date.now() });
  }

  return NextResponse.json(
    { revalidated: false, message: "Missing slug query parameter" },
    { status: 400 },
  );
}
