import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  const short_code = params.code;

  if (!short_code) {
    return NextResponse.json(
      { error: "Minning short code parameter." },
      { status: 400 }
    );
  }

  try {
    const { rowCount } = await query(
      `DELETE FROM links
       WHERE short_code = $1
       RETURNING short_code`,
      [short_code]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: `Link with code '${short_code}' not found.` },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Database error: ", error);
    return NextResponse.json(
      { error: "Failed to delete the link." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const short_code = params.code;

  if (!short_code) {
    return NextResponse.json(
      { error: "Missing short code parameter." },
      { status: 400 }
    );
  }

  try {
    const { rows } = await query(
      `SELECT short_code, target_url, total_clicks, last_clicked_at, created_at
       FROM links
       WHERE short_code = $1`,
      [short_code]
    );

    const link = rows;

    if (!link) {
      return NextResponse.json(
        {
          error: `Link with code '${short_code}' not found.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(link, { status: 200 });
  } catch (error) {
    console.error("Database Error: ", error);
    return NextResponse.json(
      { error: "Failed to retrive links stats." },
      { status: 500 }
    );
  }
}
