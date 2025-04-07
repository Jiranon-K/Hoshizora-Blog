"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminPage() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("blog_user");

    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("blog_user");

        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <AdminNavbar user={user} onLogout={handleLogout} />

      <div className="container mx-auto p-6">
        <div className="bg-neutral-900 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              แดชบอร์ดผู้ดูแลระบบ
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
              ออกจากระบบ
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              ยินดีต้อนรับ, {user.display_name}
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || "/avatar/default.webp"}
                alt={user.display_name}
                className="w-16 h-16 rounded-full"
              />
              <div className="text-white">
                <p>
                  <span className="font-semibold">อีเมล:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">สถานะ:</span>{" "}
                  {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้เขียน"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">
                จัดการบทความ
              </h3>
              <p className="text-blue-600 mb-4">
                เพิ่ม แก้ไข หรือลบบทความในบล็อกของคุณ
              </p>
              <button
                onClick={() => router.push("/admin/posts")}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full"
              >
                จัดการบทความ
              </button>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                จัดการหมวดหมู่
              </h3>
              <p className="text-green-600 mb-4">
                เพิ่ม แก้ไข หรือลบหมวดหมู่บทความ
              </p>
              <button
                onClick={() => router.push("/admin/categories")}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 w-full"
              >
                จัดการหมวดหมู่
              </button>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold mb-2 text-indigo-600">
                จัดการผู้ใช้
              </h3>
              <p className="text-indigo-600 mb-4">
                จัดการข้อมูลผู้ใช้และสิทธิ์การเข้าถึง
              </p>
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200 w-full"
              >
                จัดการผู้ใช้
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
