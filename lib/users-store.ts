"use client";

import { mutate } from "swr";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Fan" | "Team" | "Organizer" | "Admin";
  status: "Active" | "Suspended";
  joined: string;
}

const defaultUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    role: "Fan",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Team",
    status: "Active",
    joined: "2024-02-20",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike@example.com",
    role: "Organizer",
    status: "Active",
    joined: "2024-01-08",
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily@example.com",
    role: "Fan",
    status: "Suspended",
    joined: "2024-03-12",
  },
];

let users: User[] = [...defaultUsers];

export function getUsers(): User[] {
  return users;
}

export function addUser(user: Omit<User, "id" | "joined">): User {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    joined: new Date().toISOString().split("T")[0],
  };
  users = [newUser, ...users];
  mutate("users");
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  users = [...users];
  mutate("users");
  return users[index];
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  users = users.filter((u) => u.id !== id);
  mutate("users");
  return true;
}

export function useUsers() {
  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
}
