"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Copy, Trash2, ArrowRight } from "lucide-react";

interface Link {
  short_code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

interface LinkTableProps {
  basePath: string;
  links: Link[];
  onDelete: (code: string) => void;
  onRefresh: () => void;
}

const truncateUrl = (url: string, length: number = 50) => {
  if (url.length <= length) return url;
  return url.substring(0, length) + "...";
};

function TableRow({
  link,
  basePath,
  onDelete,
}: {
  link: Link;
  basePath: string;
  onDelete: (code: string) => void;
}) {
  const shortUrl = `${basePath}/${link.short_code}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert(`Copied: ${shortUrl}`);
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 text-indigo-600 font-medium">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          /{link.short_code}
        </a>
      </td>
      <td className="p-3">
        <span title={link.target_url}>{truncateUrl(link.target_url)}</span>
      </td>
      <td className="p-3 whitespace-nowrap">
        <div className="flex space-x-2">
          <button>
            <Copy size={16} />
          </button>

          <a
            href={`/code/${link.short_code}`}
            className="text-gray-500 hover:text-indigo-600 p-1 rounded-full bg-gray-100"
            title="View Stats"
          >
            <ArrowRight size={16} />
          </a>

          <button
            onClick={() => onDelete(link.short_code)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100"
            title="Delete Link"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function LinkTable({
  basePath,
  links,
  onDelete,
  onRefresh,
}: LinkTableProps) {
  const [filter, setFilter] = useState("");

  const filteredLinks = useMemo(() => {
    if (!filter) return links;

    const lowerFilter = filter.toLowerCase();

    return links.filter(
      (link) =>
        link.short_code.toLowerCase().includes(lowerFilter) ||
        link.target_url.toLowerCase().includes(lowerFilter)
    );
  }, [links, filter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Short Links
        </h2>
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-2 sm:mt-0 p-2 border border-gray-300 rounded-md shadow-sm w-full sm:w-auto"
        />
        <button className="mt-2 sm:mt-0 p-2 border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200">
          Refresh
        </button>

        {links.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            <p className="text-lg">No short links created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short Code
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target URL
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Last Clicks
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Last Clicked
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <TableRow
                    key={link.short_code}
                    link={link}
                    basePath={basePath}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
            {filteredLinks.length === 0 && links.length > 0 && (
              <div className="text-center py-4 text-gray-500 border-t">
                No results found for "{filter}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
