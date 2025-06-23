"use client";

import { useState, useEffect, useMemo, FC, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import api from "@/services/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface Template {
  _id: string;
  name: string;
  description: string;
  isPremium: boolean;
}

interface CV {
  _id: string;
  user: string;
  title: string;
  createdAt: string;
}

type ViewType =
  | "ADMINS"
  | "BASIC_USERS"
  | "PREMIUM_USERS"
  | "TEMPLATES"
  | "CVS";

type Entity = User | Template | CV;

interface DataTableProps<T extends { _id: string }> {
  data: T[];
  columns: { Header: string; accessor: keyof T }[];
  title: string;
  onAdd: () => void;
  onUpdate: (item: T) => void;
  onDelete: (item: T) => void;
}

const DataTable = <T extends { _id: string }>({
  data,
  columns,
  title,
  onAdd,
  onUpdate,
  onDelete,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [data, searchTerm]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full text-white border border-white/40">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 rounded-full py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
          </div>
          <Button
            onClick={onAdd}
            className="bg-rose-500 hover:bg-rose-600 rounded-full px-6 py-2"
          >
            Add
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/20">
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className="p-3 first:rounded-l-lg last:rounded-r-lg"
                >
                  {col.Header}
                </th>
              ))}
              <th className="p-3 last:rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item: T) => (
              <tr key={item._id} className="border-b border-white/10">
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="p-3">
                    {String(item[col.accessor])}
                  </td>
                ))}
                <td className="p-3 flex gap-2">
                  <Button
                    onClick={() => onUpdate(item)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => onDelete(item)}
                    size="sm"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          Export Data
        </Button>
        <div className="flex items-center gap-4">
          <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-black/20 rounded p-1"
          >
            {[10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>("BASIC_USERS");
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);

  const fetchData = useCallback(() => {
    api.get("/api/users").then((res) => setUsers(res.data.data || []));
    api.get("/api/templates").then((res) => setTemplates(res.data.data || []));
    api.get("/api/cv").then((res) => setCvs(res.data.data || []));
  }, []);

  useEffect(() => {
    if (!loading && user && !user.isAdmin) {
      router.push("/dashboard");
    }
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user, loading, router, fetchData]);

  const handleAdd = () => {
    setEditingEntity(null);
    setModalOpen(true);
  };

  const handleUpdate = (item: Entity) => {
    setEditingEntity(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: Entity) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${activeView.slice(0, -1)}?`
      )
    )
      return;

    const endpointMap = {
      ADMINS: "users",
      BASIC_USERS: "users",
      PREMIUM_USERS: "users",
      TEMPLATES: "templates",
      CVS: "cv",
    };
    const endpoint = `/api/${endpointMap[activeView]}/${item._id}`;

    try {
      await api.delete(endpoint);
      fetchData();
    } catch (error) {
      console.error("Failed to delete entity:", error);
      alert("Deletion failed. See console for details.");
    }
  };

  const sidebarItems: ViewType[] = [
    "ADMINS",
    "BASIC_USERS",
    "PREMIUM_USERS",
    "TEMPLATES",
    "CVS",
  ];

  const activeData = useMemo(() => {
    switch (activeView) {
      case "ADMINS":
        return users.filter((u) => u.isAdmin);
      case "BASIC_USERS":
        return users.filter((u) => !u.isPremium && !u.isAdmin);
      case "PREMIUM_USERS":
        return users.filter((u) => u.isPremium);
      case "TEMPLATES":
        return templates;
      case "CVS":
        return cvs;
      default:
        return [];
    }
  }, [activeView, users, templates, cvs]);

  const userColumns: { Header: string; accessor: keyof User }[] = [
    { Header: "First Name", accessor: "firstName" },
    { Header: "Email", accessor: "email" },
    { Header: "Premium", accessor: "isPremium" },
  ];

  const templateColumns: { Header: string; accessor: keyof Template }[] = [
    { Header: "Name", accessor: "name" },
    { Header: "Premium", accessor: "isPremium" },
  ];

  const cvColumns: { Header: string; accessor: keyof CV }[] = [
    { Header: "Title", accessor: "title" },
    { Header: "User ID", accessor: "user" },
  ];

  const activeColumns = useMemo(() => {
    switch (activeView) {
      case "ADMINS":
      case "BASIC_USERS":
      case "PREMIUM_USERS":
        return userColumns;
      case "TEMPLATES":
        return templateColumns;
      case "CVS":
        return cvColumns;
      default:
        return [];
    }
  }, [activeView, userColumns, templateColumns, cvColumns]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto flex gap-8">
          <aside className="w-1/4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2 border border-white/40">
              {sidebarItems.map((item) => (
                <Button
                  key={item}
                  variant={activeView === item ? "secondary" : "ghost"}
                  onClick={() => setActiveView(item)}
                  className={`w-full justify-start p-6 text-lg rounded-xl ${activeView === item ? "text-purple-800" : "text-white"}`}
                >
                  {item.replace("_", " ")}
                </Button>
              ))}
            </div>
          </aside>

          <main className="w-3/4">
            <DataTable
              data={activeData}
              columns={activeColumns as any}
              title={activeView.replace("_", " ")}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-gray-800 text-white border-purple-500">
          <DialogHeader>
            <DialogTitle>
              {editingEntity ? "Update" : "Add"} {activeView.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          <p>Form placeholder for {activeView}</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
