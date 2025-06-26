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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import api from "@/services/api";

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
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await api.get("/api/cv");
        if (response.data.success) {
          setCvs(response.data.data);
        } else {
          setCvs([]);
        }
      } catch (err) {
        setCvs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  return (
    <div className="min-h-fit w-full flex flex-col px-4 pt-28 pb-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 h-full bg-[#2d0b2e]/90 rounded-2xl py-8 px-6 flex flex-col justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              My CV's
            </h2>
            <div className="flex-1 flex items-center">
              {loading ? (
                <div className="w-full flex items-center justify-center text-white">
                  Loading...
                </div>
              ) : cvs.length === 0 ? (
                <div className="w-full flex items-center justify-center text-white">
                  No CVs found.
                </div>
              ) : (
                <Carousel
                  opts={{ align: "start", loop: false }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {cvs.map((cv, idx) => (
                      <CarouselItem
                        key={cv._id || idx}
                        className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/3"
                      >
                        <div className="bg-[#1a0021] border border-pink-200/40 rounded-2xl flex flex-col items-center p-3 shadow-md">
                          <Image
                            alt="CV preview"
                            src={cv.thumbnail || "/cv2.jpg"}
                            width={280}
                            height={460}
                            className="rounded-xl object-cover"
                          />
                          <div className="text-white font-semibold mt-2 mb-1 text-center">
                            {cv.title}
                          </div>
                          <div className="flex w-full itemms-center justify-center gap-2">
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
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-[#1a0021] text-white border-none shadow-lg rounded-lg hover:bg-[#2d0b2e]" />
                  <CarouselNext className="bg-[#1a0021] text-white border-none shadow-lg rounded-lg hover:bg-[#2d0b2e]" />
                </Carousel>
              )}
            </div>
          </div>

          {/* Charts Section (1/3 width, stacked vertically) */}
          <div className="col-span-1 h-full flex flex-col gap-4">
            {/* Donut Chart Card */}
            <div className="flex-1 bg-[#2d0b2e]/90 rounded-2xl p-0 flex flex-col items-center justify-center min-h-[180px]">
              <div className="flex flex-col items-center justify-center h-full w-full py-4">
                <div className="text-white font-semibold mb-2 text-center">
                  Filled sections
                </div>
                <div className="flex flex-row items-center justify-center">
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
                  <div className="flex flex-col items-center gap-1 mt-2">
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
                  <div className="flex gap-6 mt-4 justify-center">
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
              </div>
            </div>
            {/* Bar Chart Card */}
            <div className="flex-1 bg-[#2d0b2e]/90 rounded-2xl p-0 flex flex-col items-center justify-center min-h-[180px]">
              <div className="flex flex-col items-center justify-center h-full w-full py-4">
                <div className="w-full flex flex-col items-center">
                  <ResponsiveContainer width="95%" height={100}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fff2" />
                      <XAxis dataKey="name" stroke="#fff" fontSize={12} />
                      <YAxis stroke="#fff" fontSize={12} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#f7a18e"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: 4 cards in a row, h-fit, equal height */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {/* Scatter Chart Card */}
          <div className="bg-[#2d0b2e]/90 rounded-2xl p-0 flex flex-col items-center justify-center min-h-[170px]">
            <div className="flex flex-col items-center justify-center w-full py-4">
              <ResponsiveContainer width="90%" height={140}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fff2" />
                  <XAxis dataKey="x" stroke="#fff" fontSize={12} />
                  <YAxis dataKey="y" stroke="#fff" fontSize={12} />
                  <Tooltip />
                  <Scatter data={scatterData} fill="#e78a7a" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Stats Card 1 */}
          <div className="bg-[#2d0b2e]/90 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-white text-lg font-semibold mb-2">
              Total CV's
            </div>
            <div className="text-4xl font-bold text-white mb-2">11</div>
          </div>
          {/* Stats Card 2 */}
          <div className="bg-[#2d0b2e]/90 rounded-2xl p-4 flex flex-col items-center justify-center px-6">
            <div className="text-white text-lg font-semibold mb-2">
              Templates Used
            </div>
            <div className="text-4xl font-bold text-white mb-2">8</div>
          </div>
          {/* Stats Card 3 */}
          <div className="bg-[#2d0b2e]/90 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-white text-lg font-semibold mb-2">
              Profile Completion
            </div>
            <div className="text-4xl font-bold text-white mb-2">85%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
