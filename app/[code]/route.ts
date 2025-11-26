import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const short_code = params.code;

  if (!short_code) {
    return NextResponse.json({ error: "Missing short code." }, { status: 404 });
  }

  try {
    const { rows } = await query(
      `SELECT target_url
       FROM links
       WHERE short_code = $1`,
      [short_code]
    );

    const link = rows[0];

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const targetUrl = link.target_url;

    await query(
      `UPDATE links
       SET total_clicks = total_clicks + 1,
           last_clicked_at = NOW()
       WHERE short_code = $1`,
      [short_code]
    );

    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error("Redirect error: ", error);
    return NextResponse.json(
      { error: "Internal server error during redirect." },
      { status: 500 }
    );
  }
}
