"use client";

import isUrl from "is-url";
import React, { useState } from "react";

interface Link {
  id: number;
  target_url: string;
  short_code: string;
  total_clicks: number;
  last_clicked_at: string | null;
}

interface LinkData {
  target_url: string;
  short_code: string;
}

interface LinkFormProps {
  onLinkCreated: (newLink: Link) => void;
}

export default function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [formData, setFormData] = useState<LinkData>({
    target_url: "",
    short_code: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof LinkData]: value }));
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.target_url) {
      setError("Target URL is required.");
      return false;
    }
    if (!isUrl(formData.target_url)) {
      setError("Please enter a valid URL (e.g., https://google.com).");
      return false;
    }
    if (
      formData.short_code &&
      !/^[A-Za-z0-9]{6,8}$/.test(formData.short_code)
    ) {
      setError("Custom code must be 6-8 alphanumeric characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    const payload = {
      target_url: formData.target_url,
      short_code: formData.short_code || undefined,
    };

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        setError("Custom code already exists. Please choose another.");
      } else if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create link.");
      } else {
        const newLink: Link = await response.json();
        setSuccess(`Link created! Short code: ${newLink.short_code}`);
        setFormData({ target_url: "", short_code: "" });
        onLinkCreated(newLink);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`An unexpected error occured: ${error.message}`);
      } else {
        setError("An unexpected error occured");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Create New Short Link
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="target_url"
            className="block text-sm font-medium text-gray-700"
          >
            Target URL (Required)
          </label>
          <input
            id="target_url"
            name="target_url"
            type="url"
            required
            value={formData.target_url}
            onChange={handleChange}
            placeholder="https://your-long-url.com/..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            aria-invalid={!!error && formData.target_url === ""}
          />
        </div>

        <div>
          <label
            htmlFor="short_code"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Short Code (Optional, 6-8 chars)
          </label>
          <input
            type="text"
            name="short_code"
            id="short_code"
            value={formData.short_code}
            onChange={handleChange}
            placeholder="e,g., mydoc"
            maxLength={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600 border border-red-200 bg-red-50 p-3 rounded-md">
            Error: {error}
          </p>
        )}
        {success && (
          <p className="text-sm font-medium text-green-700 border border-green-200 bg-green-50 p-3 rounded-md">
            Success:{success}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !formData.target_url}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition duration-150 ${
            isLoading || !formData.target_url
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? "Creating Link..." : "Shorten URL"}
        </button>
      </form>
    </div>
  );
}
