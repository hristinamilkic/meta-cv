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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toCSV, downloadCSV } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AddUserForm,
  UpdateUserForm,
  AddTemplateForm,
  UpdateTemplateForm,
  PasswordUpdateForm,
} from "@/components/admin/AdminForms";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface AdminUser {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  isRoot?: boolean;
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

type Entity = AdminUser | Template | CV;

interface DataTableProps<T extends { _id: string }> {
  data: T[];
  columns: { Header: string; accessor: keyof T }[];
  title: string;
  onAdd: () => void;
  onUpdate: (item: T) => void;
  onDelete: (item: T) => void;
  currentUserId?: string;
  entityType: "user" | "template" | "cv";
  user?: AdminUser;
  fetchData?: () => void;
  userList?: AdminUser[];
}

const DataTable = <T extends { _id: string }>({
  data,
  columns,
  title,
  onAdd,
  onUpdate,
  onDelete,
  currentUserId,
  entityType,
  loading = false,
  user,
  fetchData,
  userList,
}: DataTableProps<T> & {
  entityType: "user" | "template" | "cv";
  loading?: boolean;
  user?: AdminUser;
  fetchData?: () => void;
  userList?: AdminUser[];
}): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPageDesktop = 4;
  const itemsPerPageMobile = 2;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "update" | "delete" | "add" | null
  >(null);
  const [selectedEntity, setSelectedEntity] = useState<T | null>(null);
  const [formState, setFormState] = useState<any>({});
  const [addError, setAddError] = useState<string | null>(null);

  const getItemsPerPage = () => {
    return isMobile ? itemsPerPageMobile : itemsPerPageDesktop;
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    const itemsPerPage = getItemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, isMobile]);

  const totalPages = Math.ceil(filteredData.length / getItemsPerPage());

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  const handleDialogOpen = (type: "update" | "delete" | "add", entity: T) => {
    setDialogType(type);
    setSelectedEntity(entity);
    setFormState(entity);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedEntity(null);
    setFormState({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (dialogType === "update" && selectedEntity) {
      if (entityType === "template") {
        await onUpdate(formState);
      } else {
        if (user?.isRoot) {
          if (formState.newPassword) {
            await api.put(`/api/users/${selectedEntity._id}/password`, {
              newPassword: formState.newPassword,
            });
          }
          const { newPassword, ...updateData } = formState;
          await onUpdate(updateData);
        } else {
          const { newPassword, ...updateData } = formState;
          await onUpdate(updateData);
        }
      }
    }
    handleDialogClose();
    if (fetchData) fetchData();
  };

  const handleDelete = async () => {
    if (selectedEntity) await onDelete(selectedEntity);
    handleDialogClose();
    if (fetchData) fetchData();
  };

  const handleAdd = async () => {
    setAddError(null);
    try {
      let submitData = { ...formState };
      if (title === "ADMINS") {
        submitData.isAdmin = true;
        submitData.isPremium = true;
      } else if (title === "PREMIUM USERS") {
        submitData.isAdmin = false;
        submitData.isPremium = true;
      } else if (title === "BASIC USERS") {
        submitData.isAdmin = false;
        submitData.isPremium = false;
      }
      if (title === "ADMINS" && user && user.isRoot) {
        await api.post("/api/users/create-admin", submitData);
        handleDialogClose();
      } else if (
        (title === "BASIC USERS" || title === "PREMIUM USERS") &&
        submitData
      ) {
        await api.post("/api/users/create", submitData);
        handleDialogClose();
      }
      if (fetchData) fetchData();
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-full text-white border border-white/10 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Input
                id="search-input"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-transparent rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--mc-background))] transition-all duration-300 ${
                  isSearchExpanded
                    ? "w-full sm:w-64 pl-4"
                    : "w-0 sm:w-0 pl-0 pr-0 opacity-0 sm:opacity-100 sm:pl-10"
                }`}
              />
              <button
                type="button"
                onClick={handleSearchIconClick}
                className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 text-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-accent))] transition-all duration-300 ${
                  isSearchExpanded
                    ? "left-2.5 opacity-0 pointer-events-none"
                    : "left-2.5"
                }`}
              >
                <Icon name="search" className="w-5 h-5" />
              </button>
              {isSearchExpanded && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchTerm("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-accent))] transition-colors"
                >
                  <Icon name="x" className="w-5 h-5" />
                </button>
              )}
            </div>
            {entityType === "cv" ? null : title === "TEMPLATES" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button disabled variant="destructive">
                        Add
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                onClick={() => {
                  setFormState({});
                  setDialogType("add");
                  setDialogOpen(true);
                }}
                variant="destructive"
                disabled={title === "ADMINS" && user && !user.isRoot}
              >
                Add
              </Button>
            )}
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogType === "update"
                  ? `UPDATE ${entityType.charAt(0).toUpperCase() + entityType.slice(1).toUpperCase()}`
                  : dialogType === "delete"
                    ? `DELETE ${entityType.charAt(0).toUpperCase() + entityType.slice(1).toUpperCase()}`
                    : `ADD ${entityType.charAt(0).toUpperCase() + entityType.slice(1).toUpperCase()}`}
              </DialogTitle>
            </DialogHeader>
            {dialogType === "update" &&
            selectedEntity &&
            title === "ADMINS" &&
            user &&
            user.isRoot ? (
              <UpdateUserForm
                formState={formState}
                setFormState={setFormState}
                handleFormChange={handleFormChange}
                user={user}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
              />
            ) : dialogType === "update" && selectedEntity ? (
              entityType === "template" ? (
                <UpdateTemplateForm
                  formState={formState}
                  setFormState={setFormState}
                  handleFormChange={handleFormChange}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                />
              ) : (
                <UpdateUserForm
                  formState={formState}
                  setFormState={setFormState}
                  handleFormChange={handleFormChange}
                  user={user}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                />
              )
            ) : dialogType === "add" ? (
              entityType === "template" ? (
                <AddTemplateForm
                  formState={formState}
                  setFormState={setFormState}
                  handleFormChange={handleFormChange}
                  addError={addError}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                  }}
                />
              ) : (
                <AddUserForm
                  formState={formState}
                  setFormState={setFormState}
                  handleFormChange={handleFormChange}
                  title={title}
                  addError={addError}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                  }}
                />
              )
            ) : null}
            {dialogType === "delete" && (
              <div className="text-center py-4">
                Are you sure you want to delete this {entityType}?
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              {dialogType === "update" && (
                <Button type="button" onClick={handleUpdate}>
                  Save
                </Button>
              )}
              {dialogType === "delete" && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  variant="destructive"
                >
                  Delete
                </Button>
              )}
              {dialogType === "add" && (
                <Button type="button" onClick={handleAdd}>
                  Save
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="overflow-x-auto w-full">
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
              {loading
                ? Array.from({ length: 4 }).map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-white/10">
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="p-3">
                          <Skeleton className="h-5 w-full" />
                        </td>
                      ))}
                      <td className="p-3 flex gap-2">
                        <Skeleton className="h-8 w-16 rounded" />
                        <Skeleton className="h-8 w-16 rounded" />
                      </td>
                    </tr>
                  ))
                : paginatedData.map((item: T) => (
                    <tr
                      key={(item as any)._id}
                      className="border-b border-white/10"
                    >
                      {columns.map((col) => (
                        <td key={String(col.accessor)} className="p-3">
                          {col.accessor === "isPremium" ? (
                            <div className="flex items-center justify-center w-full h-full">
                              {item[col.accessor] ? (
                                <Icon
                                  name="success"
                                  className="w-5 h-5 text-green-400"
                                />
                              ) : (
                                <Icon
                                  name="x"
                                  className="w-5 h-5 text-red-300"
                                />
                              )}
                            </div>
                          ) : col.accessor === "isRoot" ? (
                            <div className="flex items-center justify-center w-full h-full">
                              {item[col.accessor] ? (
                                <Icon
                                  name="success"
                                  className="w-5 h-5 text-green-400"
                                />
                              ) : (
                                <Icon
                                  name="x"
                                  className="w-5 h-5 text-red-300"
                                />
                              )}
                            </div>
                          ) : col.accessor === "user" && entityType === "cv" ? (
                            (() => {
                              const userObj = (item as any).userId;
                              return userObj && typeof userObj === "object"
                                ? `${userObj.firstName} ${userObj.lastName}`
                                : "-";
                            })()
                          ) : (
                            <span>{String(item[col.accessor])}</span>
                          )}
                        </td>
                      ))}
                      <td className="p-3 flex gap-2">
                        {entityType !== "cv" &&
                          (title === "ADMINS" ? (
                            user?.isRoot ? (
                              <Button
                                onClick={() => handleDialogOpen("update", item)}
                                size="sm"
                              >
                                Update
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleDialogOpen("update", item)}
                                size="sm"
                                disabled={(item as any)._id !== currentUserId}
                              >
                                Update
                              </Button>
                            )
                          ) : (
                            <Button
                              onClick={() => handleDialogOpen("update", item)}
                              size="sm"
                            >
                              Update
                            </Button>
                          ))}
                        {title === "ADMINS" ? (
                          <Button
                            onClick={() => handleDialogOpen("delete", item)}
                            size="sm"
                            variant="destructive"
                            disabled={
                              user?.isRoot
                                ? (item as any).isRoot ||
                                  (item as any)._id === currentUserId
                                : true
                            }
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleDialogOpen("delete", item)}
                            size="sm"
                            variant="destructive"
                            disabled={
                              typeof (item as any).isRoot !== "undefined" &&
                              ((item as any).isRoot ||
                                (currentUserId &&
                                  (item as any)._id === currentUserId))
                            }
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="self-start sm:self-auto sm:w-auto w-full">
            <Button
              onClick={() => {
                const csv = toCSV(filteredData, columns);
                downloadCSV(
                  csv,
                  `${title.replace(/\s+/g, "_").toLowerCase()}_export.csv`
                );
              }}
            >
              Export Data
            </Button>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>("ADMINS");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = useCallback(() => {
    setDataLoading(true);
    Promise.all([
      api.get("/api/users/all").then((res) => setUsers(res.data || [])),
      api
        .get("/api/templates")
        .then((res) => setTemplates(res.data.data || [])),
      activeView === "CVS"
        ? api.get("/api/cv/all").then((res) => setCvs(res.data.data || []))
        : api.get("/api/cv").then((res) => setCvs(res.data.data || [])),
    ]).finally(() => setDataLoading(false));
  }, [activeView]);

  useEffect(() => {
    if (!loading && user && !user.isAdmin) {
      router.push("/dashboard");
    }
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user, loading, router, fetchData]);

  useEffect(() => {
    console.log("Users state after fetch:", users);
  }, [users]);

  const activeData = useMemo(() => {
    switch (activeView) {
      case "ADMINS":
        return users.filter((u) => u.isAdmin);
      case "BASIC_USERS":
        return users.filter((u) => !u.isAdmin && !u.isPremium);
      case "PREMIUM_USERS":
        return users.filter((u) => u.isPremium && !u.isAdmin);
      case "TEMPLATES":
        return templates;
      case "CVS":
        return cvs;
      default:
        return [];
    }
  }, [activeView, users, templates, cvs]);

  useEffect(() => {
    if (activeData.length) {
      console.log("Active data for table:", activeData);
    }
  }, [activeData]);

  const handleAdd = () => {
    setEditingEntity(null);
    setModalOpen(true);
  };

  const handleUpdate = async (item: Entity) => {
    const endpointMap = {
      ADMINS: "users",
      BASIC_USERS: "users",
      PREMIUM_USERS: "users",
      TEMPLATES: "templates",
      CVS: "cv",
    };
    const endpoint = `/api/${endpointMap[activeView]}/${item._id}`;

    try {
      await api.put(endpoint, item);
      fetchData();
    } catch (error) {
      console.error("Failed to update entity:", error);
    }
  };

  const handleDelete = async (item: Entity) => {
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
    }
  };

  const sidebarItems: ViewType[] = [
    "ADMINS",
    "BASIC_USERS",
    "PREMIUM_USERS",
    "TEMPLATES",
    "CVS",
  ];

  const getColumns = () => {
    switch (activeView) {
      case "TEMPLATES":
        return [
          { Header: "Name", accessor: "name" },
          { Header: "Premium", accessor: "isPremium" },
        ];
      case "CVS":
        return [
          { Header: "Title", accessor: "title" },
          { Header: "User", accessor: "user" },
        ];
      default:
        return [
          { Header: "First Name", accessor: "firstName" },
          { Header: "Last Name", accessor: "lastName" },
          { Header: "Email", accessor: "email" },
          { Header: "Premium", accessor: "isPremium" },
        ];
    }
  };
  const activeColumns = getColumns();

  const normalizedUser: AdminUser | undefined = user
    ? {
        _id: (user as any)._id || (user as any).id || "",
        id: (user as any).id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
        isRoot: (user as any).isRoot,
        createdAt: user.createdAt || "",
      }
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-8">
          <div className="block sm:flex sm:justify-center overflow-x-auto w-full py-4 whitespace-nowrap">
            <div className="inline-flex min-w-max gap-2 items-center border border-white/20 rounded-xl p-2 mx-auto">
              {sidebarItems.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveView(item)}
                    className={`whitespace-nowrap min-w-max px-6 py-3 text-sm md:text-base rounded-lg transition-colors duration-150 ${
                      activeView === item
                        ? "text-[hsl(var(--mc-secondary))] bg-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-background))] transition-all duration-300 shadow-lg"
                        : "text-white bg-transparent shadow-none"
                    }`}
                  >
                    {item.replace("_", "  ")}
                  </Button>
                  {index < sidebarItems.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-white/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <main className="w-full sm:w-[86%] flex justify-center">
            <DataTable
              data={activeData as any}
              columns={activeColumns as any}
              title={activeView.replace("_", " ")}
              onAdd={handleAdd}
              onUpdate={handleUpdate as any}
              onDelete={handleDelete as any}
              currentUserId={normalizedUser ? normalizedUser._id : ""}
              entityType={
                activeView === "TEMPLATES"
                  ? "template"
                  : activeView === "CVS"
                    ? "cv"
                    : "user"
              }
              loading={dataLoading}
              user={normalizedUser}
              fetchData={fetchData}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
