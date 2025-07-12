"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

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

interface AddUserFormProps {
  formState: any;
  setFormState: (state: any) => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  addError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

interface UpdateUserFormProps {
  formState: any;
  setFormState: (state: any) => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  user?: AdminUser;
  onSubmit: (e: React.FormEvent) => void;
}

interface AddTemplateFormProps {
  formState: any;
  setFormState: (state: any) => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

interface UpdateTemplateFormProps {
  formState: any;
  setFormState: (state: any) => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface PasswordUpdateFormProps {
  formState: any;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddUserForm = ({
  formState,
  setFormState,
  handleFormChange,
  title,
  addError,
  onSubmit,
}: AddUserFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formState.firstName || ""}
          onChange={handleFormChange}
          placeholder="Enter first name"
          variant="light"
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formState.lastName || ""}
          onChange={handleFormChange}
          placeholder="Enter last name"
          variant="light"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          value={formState.email || ""}
          onChange={handleFormChange}
          placeholder="Enter email address"
          type="email"
          variant="light"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          value={formState.password || ""}
          onChange={handleFormChange}
          placeholder="Enter password"
          type="password"
          variant="light"
          required
        />
      </div>
      <div className="flex items-center gap-4 border border-black/40 w-fit rounded-lg p-2">
        <div className="flex items-center gap-2">
          <Checkbox id="isAdmin" checked={title === "ADMINS"} disabled />
          <Label htmlFor="isAdmin">ADMIN</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isPremium"
            checked={title === "ADMINS" || title === "PREMIUM USERS"}
            disabled
          />
          <Label htmlFor="isPremium">PREMIUM</Label>
        </div>
      </div>
      {addError && <div className="text-red-500 text-sm">{addError}</div>}
    </form>
  );
};

export const UpdateUserForm = ({
  formState,
  setFormState,
  handleFormChange,
  user,
  onSubmit,
}: UpdateUserFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-black" htmlFor="firstName">
          First Name
        </Label>
        <Input
          id="firstName"
          name="firstName"
          value={formState.firstName || ""}
          onChange={handleFormChange}
          placeholder="Enter first name"
          variant="light"
        />
      </div>
      <div>
        <Label className="text-gray-900" htmlFor="lastName">
          Last Name
        </Label>
        <Input
          id="lastName"
          name="lastName"
          value={formState.lastName || ""}
          onChange={handleFormChange}
          placeholder="Enter last name"
          variant="light"
        />
      </div>
      <div>
        <Label className="text-gray-900" htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          value={formState.email || ""}
          onChange={handleFormChange}
          placeholder="Enter email address"
          type="email"
          variant="light"
        />
        {user?.isRoot && (
          <div className="mt-4">
            <Label className="text-gray-900" htmlFor="newPassword">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              value={formState.newPassword || ""}
              onChange={handleFormChange}
              placeholder="Enter new password"
              type="password"
              variant="light"
            />
          </div>
        )}
      </div>
      {!(formState.isAdmin || false) && (
        <div className="flex justify-end">
          <div className="flex items-center my-2 gap-4 border border-[hsl(var(--mc-warm))] w-fit rounded-lg p-2">
            <Label className="text-gray-900" htmlFor="isPremium">
              PREMIUM STATUS
            </Label>
            <Switch
              id="isPremium"
              checked={!!formState.isPremium}
              onCheckedChange={(checked) =>
                setFormState({ ...formState, isPremium: !!checked })
              }
            />
          </div>
        </div>
      )}
    </form>
  );
};

export const AddTemplateForm = ({
  formState,
  setFormState,
  handleFormChange,
  addError,
  onSubmit,
}: AddTemplateFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-gray-900" htmlFor="name">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formState.name || ""}
          onChange={handleFormChange}
          placeholder="Enter template name"
          variant="dark"
          required
        />
      </div>
      <div>
        <Label className="text-gray-900" htmlFor="description">
          Description
        </Label>
        <Input
          id="description"
          name="description"
          value={formState.description || ""}
          onChange={handleFormChange}
          placeholder="Enter template description"
          variant="dark"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="isPremium"
          checked={!!formState.isPremium}
          onCheckedChange={(checked) =>
            setFormState({ ...formState, isPremium: !!checked })
          }
        />
        <Label className="text-gray-900" htmlFor="isPremium">
          Premium
        </Label>
      </div>
      {addError && <div className="text-red-500 text-sm">{addError}</div>}
    </form>
  );
};

export const UpdateTemplateForm = ({
  formState,
  setFormState,
  handleFormChange,
  onSubmit,
}: UpdateTemplateFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-gray-900" htmlFor="name">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formState.name || ""}
          onChange={handleFormChange}
          placeholder="Enter template name"
          variant="light"
        />
      </div>
      <div>
        <Label className="text-gray-900" htmlFor="description">
          Description
        </Label>
        <Input
          id="description"
          name="description"
          value={formState.description || ""}
          onChange={handleFormChange}
          placeholder="Enter template description"
          variant="light"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="isPremium"
          checked={!!formState.isPremium}
          onCheckedChange={(checked) =>
            setFormState({ ...formState, isPremium: !!checked })
          }
        />
        <Label className="text-gray-900" htmlFor="isPremium">
          Premium
        </Label>
      </div>
    </form>
  );
};

export const PasswordUpdateForm = ({
  formState,
  handleFormChange,
  onSubmit,
}: PasswordUpdateFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="text-gray-900" htmlFor="newPassword">
          New Password
        </Label>
        <Input
          id="newPassword"
          name="newPassword"
          value={formState.newPassword || ""}
          onChange={handleFormChange}
          placeholder="Enter new password"
          type="password"
          variant="dark"
        />
      </div>
    </form>
  );
};
