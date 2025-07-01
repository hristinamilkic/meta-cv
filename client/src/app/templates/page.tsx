"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Icon } from "@/components/Icon";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import api from "@/services/api";

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isPremium?: boolean;
}

const colors = ["#4A90E2", "#D0021B", "#417505", "#F8E71C", "#F5A623"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/api/templates");
        if (response.data.success) {
          setTemplates(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch templates");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [router]);

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/cv-builder?templateId=${templateId}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold mb-2">
              Error Loading Templates
            </p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 flex flex-col items-center justify-center text-white">
        <div className="w-full max-w-5xl px-4">
          <Carousel
            opts={{
              align: "center",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {templates.map((template, index) => {
                const isPremium = template.isPremium;
                const isBasicUser = user ? !user.isPremium : true;
                const showLock = isPremium && isBasicUser;

                return (
                  <CarouselItem
                    key={template._id}
                    className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                  >
                    <div className="p-2 flex justify-center">
                      <div className="group relative max-w-[280px] w-full">
                        <div
                          className={`relative aspect-[9/16] rounded-2xl overflow-hidden transition-all duration-300 shadow-lg  ${
                            showLock
                              ? "cursor-not-allowed"
                              : "cursor-pointer hover:scale-105"
                          }`}
                          onClick={() =>
                            !showLock && handleTemplateSelect(template._id)
                          }
                        >
                          <Image
                            src={template.thumbnail}
                            alt={template.name}
                            fill
                            className={`object-cover transition-all duration-300 ${
                              showLock
                                ? "filter blur-sm"
                                : "group-hover:scale-110"
                            }`}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-white font-bold text-lg mb-1">
                                {template.name}
                              </h3>
                              <p className="text-gray-200 text-sm line-clamp-2">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                                  {template.category}
                                </span>
                                {isPremium && (
                                  <span className="px-2 py-1 bg-yellow-500/80 rounded-full text-xs text-black font-semibold">
                                    Premium
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {showLock && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="text-center">
                                <Icon
                                  name="lock"
                                  className="w-16 h-16 text-white mx-auto mb-2"
                                />
                                <p className="text-white font-semibold">
                                  Premium Template
                                </p>
                                <p className="text-gray-300 text-sm">
                                  Upgrade to access
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="bg-transparent shadow-none" />
            <CarouselNext className="bg-transparent shadow-none" />
          </Carousel>
        </div>
      </div>
    </ProtectedRoute>
  );
}
