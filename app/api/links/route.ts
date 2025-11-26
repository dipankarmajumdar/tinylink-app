import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { generateShortCode, isUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const { target_url, short_code: custom_code } = await request.json();

  if (!target_url || !isUrl(target_url)) {
    return NextResponse.json(
      { error: "Invalid or missing target_url" },
      { status: 400 }
    );
  }

  let short_code = custom_code;

  if (custom_code) {
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    if (!codeRegex.test(custom_code)) {
      return NextResponse.json(
        { error: "Custom code must be 6-8 alphanumeric characters." },
        { status: 400 }
      );
    }
  } else {
    short_code = generateShortCode();
  }

  try {
    const result = await query(
      `INSERT INTO links (short_code, target_url)
       VALUES ($1, $2)
       RETURNING short_code, target_url, total_clicks, created_at`,
      [short_code, target_url]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: `The short code "${short_code}" already exists.` },
        { status: 409 }
      );
    }

    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { rows } =
      await query(`SELECT short_code, target_url, total_clicks, last_clicked_at, created_at
       FROM links
       ORDER BY created_at DESC`);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database error", error);
    return NextResponse.json(
      { error: "Failed to retrive links." },
      { status: 500 }
    );
  }
}
