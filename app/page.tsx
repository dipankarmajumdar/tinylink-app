"use client";

import LinkForm from "@/components/LinkForm";
import LinkTable from "@/components/LinkTable";
import { useCallback, useEffect, useState } from "react";

interface Link {
  short_code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>();

  const fetchLinks = useCallback(async () => {
    setIsDataLoading(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/links");
      if (!response.ok) {
        throw new Error("Failed to fetch links");
      }
      const data: Link[] = await response.json();
      setLinks(data);
    } catch (error) {
      setFetchError("Could not load links. Please check the API and database.");
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleLinkCreated = (newLink: Link) => {
    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  const handleDeleteLink = async (code: string) => {
    if (!window.confirm(`Are you sure you want to delete the link /${code}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete the link /${code}`);
      }

      setLinks((prevLinks) =>
        prevLinks.filter((link) => link.short_code !== code)
      );

      alert(`Link /${code} successfully deleted!`);
    } catch (error) {
      alert("Error deleting link. See console for details.");
      console.error(error);
    }
  };

  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">
        TinyLink Dashboard
      </h1>

      <LinkForm onLinkCreated={handleLinkCreated} />

      {isDataLoading && (
        <div className="text-center py-12 text-indigo-500 text-lg">
          Loading links...
        </div>
      )}

      {fetchError && (
        <div className="text-center p-12 text-red-600 border border-red-300 bg-red-50 rounded-lg">
          <p className="font-semibold">Error Loading Data:</p>
          <p>{fetchError}</p>
        </div>
      )}

      {!isDataLoading && !fetchError && (
        <LinkTable
          basePath={BASE_URL}
          links={links}
          onDelete={handleDeleteLink}
          onRefresh={fetchLinks}
        />
      )}
    </section>
  );
}
