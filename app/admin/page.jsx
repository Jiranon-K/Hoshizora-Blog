"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../components/AdminNavbar";
import { FiLogOut, FiFileText, FiFolder, FiUsers, FiLayout, FiChevronRight } from "react-icons/fi";

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
      const response = await fetch("/api/auth/logout", { method: "POST" });
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="loading loading-spinner text-white"></div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "โพสต์",
      desc: "จัดการและสร้างเนื้อหา",
      path: "/admin/posts",
      icon: <FiFileText size={24} />,
    },
    {
      title: "หมวดหมู่",
      desc: "จัดการและสร้างหมวดหมู่",
      path: "/admin/categories",
      icon: <FiFolder size={24} />,
    },
    {
      title: "ผู้ใช้",
      desc: "จัดการและกำหนดสิทธิ์",
      path: "/admin/users",
      icon: <FiUsers size={24} />,
    },
    {
      title: "หน้าแรก",
      desc: "จัดการและกำหนดสิทธิ์",
      path: "/admin/homepage",
      icon: <FiLayout size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black" style={{ fontFamily: '"Mitr", sans-serif', fontWeight: 300 }}>
      <AdminNavbar user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-white mb-2">
              แดชบอร์ด <span className="text-zinc-500">/ ภาพรวม</span>
            </h1>
            <p className="text-zinc-400 font-light">
              ยินดีต้อนรับกลัลบ, {user.display_name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800 transition-all"
          >
            <FiLogOut />
           ออกจากระบบ
          </button>
        </div>

        {/* Profile Summary - Minimal */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 mb-12">
            <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                        src={user.avatar || "/avatar/default.webp"}
                        alt={user.display_name}
                        className="w-full h-full object-cover"
                    />
                 </div>
                 <div>
                    <div className="flex items-center mb-1">
                        <h2 className="text-xl font-light text-white">{user.display_name}</h2>
                        <span className="px-2 py-0.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            {user.role === "admin" ? "ADMIN" : "WRITER"}
                        </span>
                    </div>
                    <p className="text-zinc-500 font-mono text-sm uppercase">{user.email}</p>
                 </div>
            </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className="group flex flex-col items-start p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-600 transition-all text-left relative overflow-hidden"
                >
                    <div className="mb-6 text-zinc-500 group-hover:text-white transition-colors">
                        {item.icon}
                    </div>
                    <h3 className="text-lg font-light text-white mb-2 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                    <p className="text-sm text-zinc-500 font-light group-hover:text-zinc-400">{item.desc}</p>
                    
                    <div className="absolute bottom-8 right-8 text-zinc-800 group-hover:text-white transition-colors">
                        <FiChevronRight size={20} />
                    </div>
                </button>
            ))}
        </div>
      </main>
    </div>
  );
}
