import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type AnalyticsResponse = {
  total_lookups: number;
  unique_iocs: number;
  ioc_type_breakdown: {
    ip: number;
    domain: number;
    url: number;
    hash: number;
  };
  recent_lookups: {
    ioc_value: string;
    ioc_type: string;
    timestamp: string;
  }[];
};

const Analytics: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check auth state from local storage.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Client-ID": "cyberlens-web",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 text-cyan-500">
            <i className="fa-solid fa-lock text-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
          <p className="text-neutral-400 mb-8">
            You need to log in to view analytics. Access detailed insights and
            threat intelligence data.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-cyan-500 text-neutral-950 font-semibold hover:bg-cyan-400 transition-colors rounded"
          >
            Log In to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!data || data.total_lookups === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-400 flex items-center justify-center">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Analytics <span className="text-cyan-400">Hub</span>
          </h1>
          <p className="text-neutral-400">
            Overview of threat detection activity and system performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overview */}
          <div className="col-span-1 lg:col-span-3 border border-neutral-800 bg-neutral-900 p-6 rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard title="Total Lookups" value={data.total_lookups} />
              <StatCard title="Unique IOCs Queried" value={data.unique_iocs} />
            </div>
          </div>

          {/* Breakdown */}
          <div className="border border-neutral-800 bg-neutral-900 p-6 rounded-sm">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">
              IOC Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <BreakdownRow label="IP" value={data.ioc_type_breakdown.ip} />
              <BreakdownRow label="Domain" value={data.ioc_type_breakdown.domain} />
              <BreakdownRow label="URL" value={data.ioc_type_breakdown.url} />
              <BreakdownRow label="Hash" value={data.ioc_type_breakdown.hash} />
            </div>
          </div>

          {/* Recent Lookups */}
          <div className="col-span-1 lg:col-span-2 border border-neutral-800 bg-neutral-900 p-6 rounded-sm">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">
              Recent Lookups
            </h3>

            {data.recent_lookups.length === 0 ? (
              <p className="text-neutral-500 text-sm">
                No recent lookups found.
              </p>
            ) : (
              <div className="space-y-3">
                {data.recent_lookups.map((item, i) => (
                  <div
                    key={i}
                    className="border border-neutral-800 bg-neutral-950 p-3 rounded text-sm"
                  >
                    <div className="font-mono break-all text-cyan-400">
                      {item.ioc_value}
                    </div>
                    <div className="flex justify-between text-neutral-500 mt-1">
                      <span className="capitalize">{item.ioc_type}</span>
                      <span>
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="border border-neutral-800 bg-neutral-950 p-5 rounded-sm">
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="text-3xl font-bold text-cyan-400 mt-1">{value}</p>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between border-b border-neutral-800 pb-1">
      <span className="text-neutral-400">{label}</span>
      <span className="text-cyan-400 font-semibold">{value}</span>
    </div>
  );
}

export default Analytics;
