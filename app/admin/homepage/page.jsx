"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../components/AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiCheck, FiX, FiSave, FiEdit3 } from "react-icons/fi";

export default function HomepageManagement() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [posts, setPosts] = useState([]);
  
  const [heroSettings, setHeroSettings] = useState({ postId: null, useLatest: true });
  const [featuredSettings, setFeaturedSettings] = useState({ postIds: ["", "", ""] });

  // R2 Image Picker state
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [r2Files, setR2Files] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
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
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    setLoading(true);
    try {
      const [categoriesRes, postsRes, settingsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/posts"),
        fetch("/api/homepage-settings"),
      ]);
      
      const categoriesData = await categoriesRes.json();
      const postsData = await postsRes.json();
      const settingsData = await settingsRes.json();
      
      setCategories(categoriesData);
      setPosts(postsData.filter(p => p.status === "published"));
      
      if (settingsData.hero?.postId) {
        setHeroSettings({ postId: settingsData.hero.postId, useLatest: false });
      }
      
      if (settingsData.featured?.postIds) {
        const postIds = [...settingsData.featured.postIds];
        while (postIds.length < 3) postIds.push("");
        setFeaturedSettings({ postIds });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchR2Files() {
    setLoadingFiles(true);
    try {
      const response = await fetch("/api/r2-files");
      const data = await response.json();
      setR2Files(data);
    } catch (error) {
      console.error("Error fetching R2 files:", error);
    } finally {
      setLoadingFiles(false);
    }
  }

  function openImagePicker() {
    setShowImagePicker(true);
    fetchR2Files();
  }

  function selectImage(url) {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        showcaseImage: url
      });
    }
    setShowImagePicker(false);
  }

  async function saveCategory(category) {
    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug,
          description: category.description,
          showcaseImage: category.showcaseImage,
          showcaseDescription: category.showcaseDescription,
        }),
      });
      
      if (response.ok) {
        await fetchData();
        setEditingCategory(null);
        alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      } else {
        const error = await response.json();
        alert(error.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  }

  async function saveHeroSettings() {
    setSaving(true);
    try {
      const response = await fetch("/api/homepage-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hero",
          heroPostId: heroSettings.useLatest ? null : heroSettings.postId,
        }),
      });
      
      if (response.ok) {
        alert("บันทึกการตั้งค่า Hero เรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  }

  async function saveFeaturedSettings() {
    setSaving(true);
    try {
      const response = await fetch("/api/homepage-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "featured",
          featuredPostIds: featuredSettings.postIds.filter(id => id),
        }),
      });
      
      if (response.ok) {
        alert("บันทึกโพสต์แนะนำเรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="loading loading-spinner loading-lg text-white"></div>
      </div>
    );
  }

  // Translation mapping for tabs
  const tabs = [
    { id: "categories", label: "หมวดหมู่" },
    { id: "featured", label: "ไฮไลท์" },
    { id: "hero", label: "แบนเนอร์" }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black" style={{ fontFamily: '"Mitr", sans-serif', fontWeight: 300 }}>
      <AdminNavbar user={user} />

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">
            หน้าแรก <span className="text-zinc-500">/ ตั้งค่า</span>
          </h1>
          <p className="text-zinc-400 font-light">
            จัดการเนื้อหาไฮไลท์และโครงสร้างของหน้าแรก
          </p>
        </header>

        {/* Minimal Tabs */}
        <div className="flex border-b border-zinc-800 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Category Showcase Tab */}
            {activeTab === "categories" && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      className={`group relative bg-zinc-950 border border-zinc-900 overflow-hidden transition-all duration-300 hover:border-zinc-700 ${editingCategory?.id === cat.id ? 'ring-1 ring-white border-transparent' : ''}`}
                    >
                      {editingCategory?.id === cat.id ? (
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-white break-words">{cat.name}</h3>
                                <div className="text-xs text-zinc-500">กำลังแก้ไข</div>
                            </div>
                          
                          <div className="space-y-4">
                            {/* Image Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500">รูปภาพหน้าปก</label>
                                <div className="relative">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editingCategory.showcaseImage || ''}
                                            readOnly
                                            className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-zinc-300 focus:outline-none focus:border-white transition-colors"
                                            placeholder="ยังไม่ได้เลือกรูปภาพ"
                                        />
                                        <button 
                                            onClick={openImagePicker}
                                            className="text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <FiImage size={18} />
                                        </button>
                                    </div>
                                    {editingCategory.showcaseImage && (
                                        <div className="mt-3 aspect-video w-full overflow-hidden bg-zinc-900 border border-zinc-800">
                                            <img src={editingCategory.showcaseImage} className="w-full h-full object-cover opacity-70" alt="Preview"/>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500">คำอธิบาย</label>
                                <textarea
                                    value={editingCategory.showcaseDescription || ''}
                                    onChange={(e) => setEditingCategory({...editingCategory, showcaseDescription: e.target.value})}
                                    rows={3}
                                    className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-zinc-300 focus:outline-none focus:border-white transition-colors resize-none placeholder:text-zinc-700"
                                    placeholder="ใส่คำอธิบายสั้นๆ..."
                                />
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 mt-2">
                            <button
                              onClick={() => saveCategory(editingCategory)}
                              disabled={saving}
                              className="flex-1 bg-white text-black py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                              {saving ? "กำลังบันทึก..." : "บันทึก"}
                            </button>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="flex-1 border border-zinc-800 text-zinc-400 py-2 text-xs font-bold uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode Card
                        <>
                            <div className="aspect-[4/3] w-full bg-zinc-900 relative">
                                {cat.showcaseImage ? (
                                    <img 
                                        src={cat.showcaseImage} 
                                        alt={cat.name}
                                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                        <FiImage size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80" />
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-xl font-light text-white mb-1">{cat.name}</h3>
                                    {cat.showcaseDescription && (
                                        <p className="text-xs text-zinc-400 line-clamp-2 font-light">{cat.showcaseDescription}</p>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => setEditingCategory({
                                    ...cat,
                                    showcaseImage: cat.showcaseImage || "",
                                    showcaseDescription: cat.showcaseDescription || ""
                                })}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-white hover:text-black"
                            >
                                <FiEdit3 size={14} />
                            </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Posts Tab */}
            {activeTab === "featured" && (
              <div className="max-w-2xl">
                 <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-8">
                    <div className="mb-8 border-b border-zinc-900 pb-8">
                         <h2 className="text-lg font-light text-white mb-2">ไฮไลท์ประจำสัปดาห์</h2>
                         <p className="text-sm text-zinc-500 font-light">เลือก 3 บทความเพื่อแสดงในส่วนแนะนำ</p>
                    </div>

                    {[0, 1, 2].map((index) => (
                        <div key={index} className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 flex justify-between">
                                <span>ตำแหน่งที่ {index + 1}</span>
                                {index === 0 && <span className="text-white">แสดงเป็นบทความหลัก</span>}
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-zinc-900/50 border-b border-zinc-800 py-3 pl-0 pr-10 text-sm text-zinc-300 focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer hover:text-white"
                                    value={featuredSettings.postIds[index] || ""}
                                    onChange={(e) => {
                                        const newIds = [...featuredSettings.postIds];
                                        newIds[index] = e.target.value;
                                        setFeaturedSettings({ postIds: newIds });
                                    }}
                                >
                                    <option value="" className="bg-zinc-900 text-zinc-500">-- เลือกบทความ --</option>
                                    {posts.map((post) => (
                                        <option key={post.id} value={post.id} className="bg-zinc-900 text-white">
                                            {post.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <button
                            onClick={saveFeaturedSettings}
                            disabled={saving}
                            className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? "กำลังบันทึก..." : <><FiSave /> บันทึกการเปลี่ยนแปลง</>}
                        </button>
                    </div>
                </div>
              </div>
            )}

            {/* Hero Section Tab */}
            {activeTab === "hero" && (
                <div className="max-w-2xl">
                    <div className="bg-zinc-950 border border-zinc-900 p-8">
                       <div className="mb-8 border-b border-zinc-900 pb-8">
                            <h2 className="text-lg font-light text-white mb-2">ส่วนแบนเนอร์ (Hero Section)</h2>
                            <p className="text-sm text-zinc-500 font-light">กำหนดสิ่งที่จะแสดงเป็นส่วนแรกสุดของหน้าเว็บ</p>
                       </div>

                       <div className="space-y-8">
                            <label className="flex items-center gap-4 group cursor-pointer">
                                <div className={`w-12 h-6 rounded-full border border-zinc-700 relative transition-colors ${heroSettings.useLatest ? 'bg-white border-white' : 'bg-transparent'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${heroSettings.useLatest ? 'left-[calc(100%-1.25rem)] bg-black' : 'left-1 bg-zinc-500'}`} />
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={heroSettings.useLatest}
                                        onChange={(e) => setHeroSettings({
                                            ...heroSettings,
                                            useLatest: e.target.checked
                                        })}
                                    />
                                </div>
                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">แสดงบทความล่าสุดเสมอ</span>
                            </label>

                            <AnimatePresence>
                                {!heroSettings.useLatest && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-2 pt-2">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500">เลือกบทความที่ต้องการ</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-zinc-900/50 border-b border-zinc-800 py-3 pl-0 pr-10 text-sm text-zinc-300 focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                                                    value={heroSettings.postId || ""}
                                                    onChange={(e) => setHeroSettings({
                                                        ...heroSettings,
                                                        postId: e.target.value || null
                                                    })}
                                                >
                                                    <option value="" className="bg-zinc-900 text-zinc-500">-- เลือกบทความ --</option>
                                                    {posts.map((post) => (
                                                        <option key={post.id} value={post.id} className="bg-zinc-900 text-white">
                                                            {post.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                                                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                             <div className="pt-6 border-t border-zinc-900/50 mt-8">
                                <button
                                    onClick={saveHeroSettings}
                                    disabled={saving}
                                    className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? "กำลังบันทึก..." : <><FiSave /> อัปเดตแบนเนอร์</>}
                                </button>
                            </div>
                       </div>
                    </div>
                </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </main>

      {/* R2 Image Picker Modal - Minimal Dark */}
      <AnimatePresence>
        {showImagePicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowImagePicker(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
                >
                    <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
                        <h3 className="text-xl font-light text-white">เลือกรูปภาพ</h3>
                        <button onClick={() => setShowImagePicker(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <FiX size={24} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
                        {loadingFiles ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="loading loading-spinner text-white"></div>
                            </div>
                        ) : r2Files.length === 0 ? (
                            <div className="h-40 flex items-center justify-center text-zinc-500 font-light">
                                ไม่พบรูปภาพในคลาวด์
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {r2Files.map((file) => (
                                    <button
                                        key={file.key}
                                        onClick={() => selectImage(file.url)}
                                        className="group relative aspect-square bg-zinc-900 overflow-hidden border border-transparent hover:border-white transition-all"
                                    >
                                        <img
                                            src={file.url}
                                            alt={file.key}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-zinc-300 truncate font-mono">{file.key}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
