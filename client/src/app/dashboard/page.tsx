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
import cvService from "@/services/cv.service";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab1, setActiveTab1] = useState("template");
  const [activeTab2, setActiveTab2] = useState("skills");
  const router = useRouter();
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"cvs" | "analytics">("cvs");

  const fetchCVs = async () => {
    setLoading(true);
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

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/api/cv/analytics");
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (err) {
      setAnalytics(null);
    }
  };

  useEffect(() => {
    fetchCVs();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (loading) return;
    const hasMissingThumbnail = cvs.some((cv) => !cv.thumbnail);
    if (!hasMissingThumbnail) return;
    const interval = setInterval(() => {
      fetchCVs();
    }, 2000);
    return () => clearInterval(interval);
  }, [cvs, loading]);

  const handleEdit = (cvId: string) => {
    router.push(`/cv-builder?cvId=${cvId}`);
  };

  const handleDelete = async (cvId: string) => {
    setActionLoading(cvId + "-delete");
    try {
      await api.delete(`/api/cv/${cvId}`);
      await fetchCVs();
    } catch (err) {
      setErrorDialog("Failed to delete CV.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (cvId: string, title: string) => {
    setActionLoading(cvId + "-download");
    try {
      const blob = await cvService.downloadCV(cvId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download =
        (title ? title.replace(/[^a-zA-Z0-9-_\. ]/g, "_") : "CV") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorDialog("Failed to download CV.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Header
        selectedTab={selectedTab}
        onTabChange={(tab) => setSelectedTab(tab as "cvs" | "analytics")}
      />
      <div className="min-h-fit w-full flex flex-col px-4 pt-28 pb-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 gap-8 bg-[#2d0b2e] rounded-3xl shadow-xl p-8">
          {selectedTab === "cvs" && (
            <div className="w-full flex flex-col justify-center min-h-[400px] max-h-[520px]">
              <h2 className="text-2xl sm:text-3xl font-thin pl-4 text-white mb-5">
                My CV's
              </h2>
              <div className="relative w-full flex items-center justify-center min-h-0">
                {loading ? (
                  <Carousel
                    opts={{ align: "start", loop: false }}
                    className="w-full min-h-0"
                  >
                    <CarouselContent>
                      {[1, 2, 3].map((i) => (
                        <CarouselItem
                          key={i}
                          className="pl-4 md:pl-8 lg:basis-1/3 min-h-0"
                        >
                          <div className="flex flex-col items-center bg-pink-800/10 border border-pink-400 rounded-2xl p-7 shadow-lg min-h-0">
                            <Skeleton className="rounded-2xl object-cover min-w-[180px] min-h-[260px] max-w-[240px] max-h-[320px] w-[240px] h-[320px]" />
                            <Skeleton className="h-7 w-40 mt-4 mb-2 rounded" />
                            <div className="flex w-fit h-full items-center justify-center gap-5 mt-2">
                              <Skeleton className="w-12 h-12 rounded-full" />
                              <Skeleton className="w-12 h-12 rounded-full" />
                              <Skeleton className="w-12 h-12 rounded-full" />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <Carousel
                    opts={{ align: "start", loop: false }}
                    className="w-full min-h-0"
                  >
                    <CarouselContent>
                      {cvs.map((cv, idx) => (
                        <CarouselItem
                          key={cv._id || idx}
                          className="pl-4 md:pl-8 lg:basis-1/3 min-h-0"
                        >
                          <div className="flex flex-col items-center bg-pink-800/10 border border-pink-400 rounded-2xl p-7 shadow-lg min-h-0">
                            <Image
                              alt="CV preview"
                              src={cv.thumbnail ? cv.thumbnail : "/cv2.jpg"}
                              width={240}
                              height={320}
                              className="rounded-2xl object-cover min-w-[180px] min-h-[260px] max-w-[240px] max-h-[320px]"
                            />
                            <div className="text-white font-light text-lg text-center truncate max-w-[220px] mt-4 mb-2">
                              {cv.title}
                            </div>
                            <div className="flex w-fit h-full items-center justify-center gap-5">
                              <Button
                                className="bg-transparent"
                                onClick={() => handleEdit(cv._id)}
                                disabled={actionLoading === cv._id + "-edit"}
                              >
                                {actionLoading === cv._id + "-edit" ? (
                                  <Icon
                                    name="loading"
                                    className="w-9 h-9 text-white"
                                  />
                                ) : (
                                  <Icon
                                    name="admin"
                                    className="w-9 h-9 text-white"
                                  />
                                )}
                              </Button>
                              <Button
                                className="bg-transparent"
                                onClick={() => handleDelete(cv._id)}
                                disabled={actionLoading === cv._id + "-delete"}
                              >
                                {actionLoading === cv._id + "-delete" ? (
                                  <Icon
                                    name="loading"
                                    className="w-9 h-9 text-white"
                                  />
                                ) : (
                                  <Icon
                                    name="x"
                                    className="w-6 h-6 text-white"
                                  />
                                )}
                              </Button>
                              <Button
                                className="bg-transparent"
                                onClick={() => handleDownload(cv._id, cv.title)}
                                disabled={
                                  actionLoading === cv._id + "-download"
                                }
                              >
                                {actionLoading === cv._id + "-download" ? (
                                  <Icon
                                    name="loading"
                                    className="w-9 h-9 text-white"
                                  />
                                ) : (
                                  <Icon
                                    name="download"
                                    className="w-9 h-9 text-white"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-transparent text-[hsl(var(--mc-background))] border-2 border-[hsl(var(--mc-background))]" />
                    <CarouselNext className="bg-transparent text-[hsl(var(--mc-background))] border-2 border-[hsl(var(--mc-background))]" />
                  </Carousel>
                )}
              </div>
            </div>
          )}
          {selectedTab === "analytics" && (
            <div className="w-full flex flex-col items-center justify-center min-h-[400px] max-h-[520px]">
              <div className="w-full h-full flex flex-col gap-6 bg-[#2d0b2e] rounded-2xl shadow-lg p-8 items-center justify-center">
                {/* Top: Stat blocks */}
                <div className="grid grid-cols-3 gap-6 w-full">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-white text-lg font-semibold mb-1 flex items-center gap-2">
                      <Icon name="cv" className="w-6 h-6" /> Total CV's
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {analytics?.totalCVs ?? 0}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-white text-lg font-semibold mb-1 flex items-center gap-2">
                      <Icon name="cv" className="w-6 h-6" /> Last Week's CV's
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {analytics?.lastWeekCVs ?? 0}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-white text-lg font-semibold mb-1 flex items-center gap-2">
                      <Icon name="dashboard" className="w-6 h-6" /> Avg.
                      Sections per CV
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {analytics?.avgSectionsPerCV?.toFixed(2) ?? 0}
                    </div>
                  </div>
                </div>
                <Separator className="my-2 bg-white/20" />
                {/* Middle: Main charts */}
                <div className="grid grid-cols-3 gap-6 w-full flex-1">
                  {/* Template Usage Pie */}
                  <div className="bg-[#2d0b2e] rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="text-white text-base font-semibold mb-2">
                      Template Usage
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={analytics?.templateUsage || []}
                          dataKey="count"
                          nameKey="templateName"
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          fill="#f7a18e"
                          label
                        >
                          {(analytics?.templateUsage || []).map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  ["#f7a18e", "#f7c28e", "#e78a7a"][index % 3]
                                }
                              />
                            )
                          )}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* CV Creation Trend Bar */}
                  <div className="bg-[#2d0b2e] rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="text-white text-base font-semibold mb-2">
                      CV Creation Trend
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={analytics?.creationTrend || []}>
                        <XAxis dataKey="month" fontSize={10} stroke="#fff" />
                        <YAxis
                          allowDecimals={false}
                          fontSize={10}
                          stroke="#fff"
                        />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#a259e6"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* CVs by Section Count (new) */}
                  <div className="bg-[#2d0b2e] rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="text-white text-base font-semibold mb-2">
                      CVs by Section Count
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart
                        data={
                          analytics?.mostSectionCVs?.map((cv: any) => ({
                            name: cv.title,
                            sections: cv.sectionCount,
                          })) || []
                        }
                      >
                        <XAxis
                          dataKey="name"
                          fontSize={10}
                          stroke="#fff"
                          interval={0}
                          angle={-20}
                          height={40}
                        />
                        <YAxis
                          allowDecimals={false}
                          fontSize={10}
                          stroke="#fff"
                        />
                        <Tooltip />
                        <Bar
                          dataKey="sections"
                          fill="#f7c28e"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <Separator className="my-2 bg-white/20" />
                {/* Bottom: Skills, Languages, Projects Ratio */}
                <div className="grid grid-cols-3 gap-6 w-full flex-1">
                  {/* Top Skills */}
                  <div className="bg-[#2d0b2e] rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="text-white text-base font-semibold mb-2">
                      Top Skills
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart
                        data={analytics?.mostCommonSkills || []}
                        layout="vertical"
                      >
                        <XAxis type="number" fontSize={10} stroke="#fff" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          fontSize={10}
                          width={60}
                          stroke="#fff"
                        />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#a259e6"
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Top Languages */}
                  <div className="bg-[#2d0b2e] rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="text-white text-base font-semibold mb-2">
                      Top Languages
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart
                        data={analytics?.mostCommonLanguages || []}
                        layout="vertical"
                      >
                        <XAxis type="number" fontSize={10} stroke="#fff" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          fontSize={10}
                          width={60}
                          stroke="#fff"
                        />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#f7c28e"
                          radius={[0, 8, 8, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* CVs with/without Projects Pie (new) */}
                  <div className="bg-[#2d0b2e] rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="text-white text-base font-semibold mb-2">
                      CVs With/Without Projects
                    </div>
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie
                          data={(() => {
                            const withProjects = (
                              analytics?.mostSectionCVs || []
                            ).filter(
                              (cv: any) =>
                                cv.sectionCount && cv.sectionCount > 0
                            ).length;
                            const withoutProjects =
                              (analytics?.mostSectionCVs || []).length -
                              withProjects;
                            return [
                              { name: "With Projects", value: withProjects },
                              {
                                name: "Without Projects",
                                value: withoutProjects,
                              },
                            ];
                          })()}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={40}
                          fill="#a259e6"
                          label
                        >
                          <Cell fill="#a259e6" />
                          <Cell fill="#f7a18e" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Error Dialog */}
        <Dialog open={!!errorDialog} onOpenChange={() => setErrorDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>{errorDialog}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
