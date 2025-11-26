import NextLink from "next/link";

interface LinkStats {
  short_code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

const formatTime = (time: string | null) => {
  if (!time) return "N/A";
  return new Date(time).toLocaleString();
};

async function getLinkStats(code: string): Promise<LinkStats | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/links/${code}`, {
      cache: "no-store",
    });

    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);

    return response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const link = await getLinkStats(code);

  if (!link) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          404 - Link Not Found
        </h1>
        <p className="text-lg text-gray-700">
          The short code{" "}
          <code className="bg-gray-100 p-1 rounded font-mono text-gray-800">
            {code}
          </code>{" "}
          does not exist or has been deleted.
        </p>
        <NextLink
          href="/"
          className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 underline"
        >
          Go to Dashboard
        </NextLink>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const shortUrl = `${baseUrl}/${link.short_code}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-0">
      <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-4">
        Stats for: <span className="text-indigo-600">/{link.short_code}</span>
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Link Information
        </h2>

        {/* Short URL */}
        <div className="border p-4 rounded-md bg-gray-50">
          <p className="text-sm font-medium text-gray-500">Short URL</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-indigo-700 break-all hover:underline"
          >
            {shortUrl}
          </a>
        </div>

        {/* Target URL */}
        <div className="border p-4 rounded-md bg-gray-50">
          <p className="text-sm font-medium text-gray-500">Target URL</p>
          <p className="text-lg text-gray-800 break-all">{link.target_url}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t mt-4">
          <StatCard
            title="Total Clicks"
            value={link.total_clicks}
            color="text-green-600"
          />
          <StatCard
            title="Last Clicked"
            value={formatTime(link.last_clicked_at)}
            color="text-blue-600"
          />
          <StatCard
            title="Link Created"
            value={formatTime(link.created_at)}
            color="text-purple-600"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
