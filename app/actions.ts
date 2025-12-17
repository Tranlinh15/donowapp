"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// READ: Có thêm logic sắp xếp (sortOption)
export async function getTodos(sortOption: string = "deadline") {
  const { userId } = await auth();

  if (!userId) return [];

  // Xử lý logic sắp xếp
  let orderBy: any = { deadline: "asc" }; // Mặc định: Hạn chót gần nhất lên đầu

  if (sortOption === "created_desc") {
    orderBy = { createdAt: "desc" }; // Mới nhất lên đầu
  } else if (sortOption === "created_asc") {
    orderBy = { createdAt: "asc" }; // Cũ nhất lên đầu
  }

  return await prisma.todo.findMany({
    where: { userId },
    orderBy: orderBy,
  });
}

// CREATE
export async function createTodo(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const text = formData.get("text") as string;
  const deadlineStr = formData.get("deadline") as string;

  if (!text) return;

  await prisma.todo.create({
    data: {
      text,
      userId,
      deadline: deadlineStr ? new Date(deadlineStr) : undefined,
      status: "pending",
    },
  });
  revalidatePath("/");
}

// UPDATE
export async function toggleTodo(id: string, currentStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const newStatus = currentStatus === "pending" ? "done" : "pending";
  const finishedTime = newStatus === "done" ? new Date() : null;

  await prisma.todo.update({
    where: { id, userId },
    data: { status: newStatus, finishedTime },
  });
  revalidatePath("/");
}

// DELETE
export async function deleteTodo(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.todo.delete({ where: { id, userId } });
  revalidatePath("/");
}

// UPDATE NỘI DUNG CÔNG VIỆC
export async function updateTodo(
  id: string,
  text: string,
  deadlineStr: string | null
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!text.trim()) return;

  await prisma.todo.update({
    where: { id, userId },
    data: {
      text,
      // Nếu có chuỗi thời gian thì convert sang Date, không thì null
      deadline: deadlineStr ? new Date(deadlineStr) : null,
    },
  });
  revalidatePath("/");
}
