"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ─── Change Password (for logged-in users) ────────────────────────────────────
export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated." };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword)
    return { error: "All fields are required." };

  if (newPassword.length < 8)
    return { error: "New password must be at least 8 characters." };

  if (newPassword !== confirmPassword)
    return { error: "New passwords do not match." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return { error: "User not found." };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Current password is incorrect." };

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/teacher");
  return { success: "Password changed successfully!" };
}

// ─── Forgot Password: send reset email ────────────────────────────────────────
export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  if (!email) return { error: "Email is required." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Return a generic message even if user not found (security)
  if (!user) return { success: "If this email is registered, a reset link has been sent." };

  // Invalidate existing tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, email, expiresAt },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://www.tuitionss.com";
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  await sendPasswordResetEmail({ to: email, name: user.name, resetUrl });

  return { success: "If this email is registered, a reset link has been sent." };
}

// ─── Reset Password: verify token and set new password ────────────────────────
export async function resetPassword(token: string, formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) return { error: "All fields are required." };
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { error: "Passwords do not match." };

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.used) return { error: "This reset link is invalid or has already been used." };
  if (new Date() > resetToken.expiresAt) return { error: "This reset link has expired. Please request a new one." };

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  return { success: "Password reset successfully! You can now log in." };
}
