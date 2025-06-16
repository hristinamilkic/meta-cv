import api from "./api";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isPremium?: boolean;
  isAdmin?: boolean;
}

const userService = {
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await api.put("/users/password", data);
    return response.data;
  },

  // Admin operations
  getAllUsers: async () => {
    const response = await api.get("/users/all");
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await api.post("/users/create", data);
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<CreateUserData>) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },
};

export default userService;
