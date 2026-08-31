"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiFetch } from "@/lib/api";

export default function RevenuePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/stats/vendor").then(setStats);
  }, []);

  if (!stats) {
    return <div className="spinner" />;
  }

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">
            Business performance
          </span>

          <h1 className="display">
            Revenue overview
          </h1>

          <p className="muted">
            Understand inventory, sales, and monthly earnings at a glance.
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card surface">
          <span>Tickets added</span>
          <b>{stats.ticketsAdded}</b>
        </div>

        <div className="stat-card surface">
          <span>Tickets sold</span>
          <b>{stats.ticketsSold}</b>
        </div>

        <div className="stat-card surface">
          <span>Total revenue</span>

          <b>
            ৳
            {Number(
              stats.totalRevenue || 0
            ).toLocaleString("en-BD")}
          </b>
        </div>
      </div>

      <div className="chart-card surface">
        <div>
          <h3>Monthly revenue</h3>

          <p className="muted">
            Successful Stripe payments
          </p>
        </div>

       <ResponsiveContainer width="100%" height={340}>
  <BarChart
    data={stats.monthly}
    margin={{
      top: 10,
      right: 20,
      left: 35,
      bottom: 5,
    }}
  >
    <CartesianGrid
      strokeDasharray="3 3"
      vertical={false}
    />

    <XAxis dataKey="_id" />

    <YAxis
      width={90}
      tickFormatter={(value) =>
        `৳${Number(value).toLocaleString("en-BD")}`
      }
    />

    <Tooltip
      formatter={(value) => [
        `৳${Number(value).toLocaleString("en-BD")}`,
        "Revenue",
      ]}
    />

    <Bar
      dataKey="revenue"
      fill="#0d725e"
      radius={[8, 8, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
      </div>
    </>
  );
}