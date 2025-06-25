"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
} from "recharts";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";

const dummyCVs = [
  {
    id: 1,
    name: "Hristina Milkić",
    image: "/cv2.png",
    email: "milkichristina@gmail.com",
  },
  {
    id: 2,
    name: "Hristina Milkić",
    image: "/cv2.png",
    email: "milkichristina@gmail.com",
  },
  {
    id: 3,
    name: "Hristina Milkić",
    image: "/cv2.png",
    email: "milkichristina@gmail.com",
  },
  {
    id: 4,
    name: "Hristina Milkić",
    image: "/cv2.png",
    email: "milkichristina@gmail.com",
  },
];

const donutData = [
  { name: "Education", value: 25, color: "#f7a18e" },
  { name: "Experience", value: 8, color: "#f7c28e" },
  { name: "Languages", value: 12, color: "#e78a7a" },
];

const barData = [
  { name: "Item 1", value: 8 },
  { name: "Item 2", value: 12 },
  { name: "Item 3", value: 18 },
  { name: "Item 4", value: 22 },
  { name: "Item 5", value: 15 },
];

const scatterData = [
  { x: 5, y: 50 },
  { x: 10, y: 100 },
  { x: 15, y: 150 },
  { x: 20, y: 200 },
  { x: 25, y: 120 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-32 pb-28 px-2">
      {/* CV Cards Carousel */}
      <div className="w-full max-w-6xl bg-[#2d0b2e]/80 rounded-3xl p-6 flex flex-col items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 w-full">
          My CV's
        </h2>
        <div className="w-full flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-white text-3xl px-2 py-0 min-w-0 h-16"
          >
            &#60;
          </Button>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {dummyCVs.map((cv, idx) => (
                <div
                  key={cv.id}
                  className="bg-[#1a0021] border border-pink-200/40 rounded-2xl flex flex-col items-center p-3 min-w-[220px] max-w-[220px] shadow-md"
                >
                  <Image
                    src={cv.image}
                    alt={cv.name}
                    width={180}
                    height={240}
                    className="rounded-xl object-cover mb-2"
                  />
                  <div className="text-white text-lg font-semibold mb-1">
                    {cv.name}
                  </div>
                  <div className="text-white/70 text-xs mb-2">{cv.email}</div>
                  <div className="flex w-full justify-between mt-2 gap-2">
                    <Button size="icon" variant="ghost">
                      <Icon
                        name="edit-profile"
                        className="w-6 h-6 text-white"
                      />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Icon name="x" className="w-6 h-6 text-white" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Icon name="cv" className="w-6 h-6 text-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-white text-3xl px-2 py-0 min-w-0 h-16"
          >
            &#62;
          </Button>
        </div>
      </div>

      {/* Stats and Charts */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Donut Chart + Stats */}
        <div className="bg-[#2d0b2e]/80 rounded-2xl p-4 flex flex-col items-center col-span-1">
          <div className="text-white font-semibold mb-2">Filled sections</div>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#f7a18e"
                label={false}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            {donutData.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-2 text-white/80 text-xs"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: d.color }}
                ></span>
                {d.value}% {d.name}
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-white text-lg font-bold">78%</span>
              <span className="text-white/60 text-xs">Shared</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-lg font-bold">22%</span>
              <span className="text-white/60 text-xs">Downloaded</span>
            </div>
          </div>
        </div>
        {/* Bar Chart */}
        <div className="bg-[#2d0b2e]/80 rounded-2xl p-4 flex flex-col items-center col-span-1">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fff2" />
              <XAxis dataKey="name" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#f7a18e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Scatter Chart */}
        <div className="bg-[#2d0b2e]/80 rounded-2xl p-4 flex flex-col items-center col-span-1">
          <ResponsiveContainer width="100%" height={120}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#fff2" />
              <XAxis dataKey="x" stroke="#fff" fontSize={12} />
              <YAxis dataKey="y" stroke="#fff" fontSize={12} />
              <Tooltip />
              <Scatter data={scatterData} fill="#e78a7a" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* Stats Card */}
        <div className="bg-[#2d0b2e]/80 rounded-2xl p-4 flex flex-col items-center col-span-1 justify-center">
          <div className="text-white text-lg font-semibold mb-2">
            Total CV's
          </div>
          <div className="text-4xl font-bold text-white mb-2">11</div>
          <div className="text-white text-lg font-semibold mb-2">
            Downloaded CV's
          </div>
          <div className="text-4xl font-bold text-white">5</div>
        </div>
      </div>
    </div>
  );
}
