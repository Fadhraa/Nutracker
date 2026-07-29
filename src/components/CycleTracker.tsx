/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
  subDays,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { CycleData } from "../types.ts";

interface Props {
  cycleData: CycleData;
}

const HISTORY_DATA = [
  { month: "Jan", length: 28, period: 5 },
  { month: "Feb", length: 30, period: 6 },
  { month: "Mar", length: 27, period: 4 },
  { month: "Apr", length: 29, period: 5 },
  { month: "Mei", length: 28, period: 5 },
];

export default function CycleTracker({ cycleData }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-serif font-bold italic text-slate-900">
        Period Calendar
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-rose-100 rounded-xl transition-colors"
        >
          <ChevronLeft className="text-rose-600" />
        </button>
        <span className="text-sm font-black uppercase tracking-widest text-slate-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-rose-100 rounded-xl transition-colors"
        >
          <ChevronRight className="text-rose-600" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        // Logic for period days (simplified projection)
        const periodStart = parseISO(cycleData.lastPeriodDate);
        const diff = Math.floor(
          (day.getTime() - periodStart.getTime()) / (1000 * 3600 * 24),
        );
        const isPeriodDay =
          diff >= 0 && diff % cycleData.cycleLength < cycleData.periodLength;
        const isPredictedOvulation = diff % cycleData.cycleLength === 13;

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-24 border border-rose-50 p-2 relative transition-all cursor-pointer group hover:bg-rose-50/50",
              !isSameMonth(day, monthStart)
                ? "text-slate-200"
                : "text-slate-800",
              isSameDay(day, selectedDate) && "bg-rose-100 border-rose-200",
            )}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="text-xs font-bold">{formattedDate}</span>
            {isPeriodDay && (
              <div className="absolute inset-x-1 bottom-1 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-sm" />
            )}
            {isPredictedOvulation && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            )}
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return (
      <div className="rounded-3xl overflow-hidden border border-rose-100 bg-white">
        {rows}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rose-100 mt-8">
            <h3 className="font-serif text-2xl font-bold italic mb-6">
              Cycle Trends
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HISTORY_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#fef2f2"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#fff1f2" }}
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="length" radius={[10, 10, 0, 0]}>
                    {HISTORY_DATA.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.length > 29 ? "#f43f5e" : "#fda4af"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">
              Cycle Length Analysis (Last 5 Months)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-rose-100">
            <h3 className="font-serif text-xl font-bold italic mb-6">Legend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-rose-500 rounded-full shadow-lg shadow-rose-200" />
                <span className="text-sm font-bold text-slate-600">
                  Period Days
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-lg shadow-emerald-100" />
                <span className="text-sm font-bold text-slate-600">
                  Ovulation window
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-rose-50 border border-rose-100 rounded-full" />
                <span className="text-sm font-bold text-slate-600">
                  Regular Days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-rose-600 p-8 rounded-[2rem] text-white shadow-xl shadow-rose-200">
            <h3 className="font-serif text-xl font-bold italic mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Avg Cycle
                </div>
                <div className="text-2xl font-black">28 Days</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Next Period
                </div>
                <div className="text-2xl font-black">In 4 Days</div>
              </div>
            </div>
            <button className="w-full mt-6 py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
              Edit Cycle History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
