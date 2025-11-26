import { NextResponse } from "next/server";

const START_TIME = new Date();

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return `${days}d ${hours}h ${minutes} ${Math.floor(seconds)}s`;
}

export async function GET() {
  const uptimeSeconds = (Date.now() - START_TIME.getTime()) / 1000;

  const response = {
    ok: true,
    version: "1.0",
    uptime: formatUptime(uptimeSeconds),
  };

  return NextResponse.json(response, { status: 200 });
}
