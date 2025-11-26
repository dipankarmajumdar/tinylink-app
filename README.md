# 🔗 TinyLink: A URL Shortener

**TinyLink** is a lightweight URL shortening service built with the Next.js App Router. It is designed to create short, memorable links, track click statistics, and provide a clean dashboard for link management, adhering strictly to the assignment specifications for stability and testability.

## ✨ Core Features

- **Short Link Generation:** Creates a short redirection code for a long URL.
- **Custom Codes:** Supports optional custom alphanumeric short codes (6 to 8 characters).
- **Redirection:** Implements `HTTP 302 Redirect` from `/:code` to the original URL.
- **Click Tracking:** Automatically increments the `total_clicks` count and updates the `last_clicked_at` timestamp on every successful redirect.
- **Link Management:** Allows users to view all links on the dashboard and delete existing links.
- **Stats Page:** Dedicated page `/code/:code` to view detailed statistics for a single link.
- **Health Check:** Stable endpoint for system monitoring (`/healthz`).

---

## 🛠️ Technology Stack

| Category            | Technology             | Purpose                                                                  |
| :------------------ | :--------------------- | :----------------------------------------------------------------------- |
| **Frontend**        | Next.js (App Router)   | React framework for server-side rendering and client-side interactivity. |
| **Styling**         | Tailwind CSS           | Utility-first CSS framework for rapid and responsive design.             |
| **Backend**         | Next.js (API Routes)   | Serverless functions for handling API requests.                          |
| **Database**        | PostgreSQL (via Neon)  | Persistent storage for links and click statistics.                       |
| **Database Driver** | `node-postgres` (`pg`) | Reliable client for connecting Next.js API routes to Postgres.           |

---

## 🚀 Getting Started (Local Setup)

Follow these steps to get a local copy of TinyLink running on your machine.

### 1. Prerequisites

You will need the following installed:

- Node.js (v18+)
- npm or pnpm or yarn
- A **Neon PostgreSQL** database

### 2. Clone the Repository

```bash
git clone <dipankarmajumdar/tinylink-app>
cd tinylink-app
```
