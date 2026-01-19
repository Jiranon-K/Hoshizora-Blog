"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../components/AdminNavbar";

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
        alert("บันทึกสำเร็จ!");
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
        alert("บันทึกการตั้งค่า Hero สำเร็จ!");
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
        alert("บันทึกการตั้งค่า Featured สำเร็จ!");
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
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <AdminNavbar user={user} />

      <div className="container mx-auto p-6">
        <div className="bg-neutral-900 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            จัดการหน้าแรก
          </h1>

          {/* Tabs */}
          <div className="tabs tabs-boxed bg-neutral-800 mb-6">
            <button 
              className={`tab ${activeTab === "categories" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              หมวดหมู่ Showcase
            </button>
            <button 
              className={`tab ${activeTab === "featured" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("featured")}
            >
              โพสต์เด่น
            </button>
            <button 
              className={`tab ${activeTab === "hero" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("hero")}
            >
              Hero Section
            </button>
          </div>

          {/* Category Showcase Tab */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                แก้ไขรูปภาพและคำอธิบายสำหรับแต่ละหมวดหมู่ที่แสดงในหน้าแรก
              </p>
              
              <div className="grid gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-neutral-800 rounded-lg p-4">
                    {editingCategory?.id === cat.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="label text-white">ชื่อหมวดหมู่</label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={editingCategory.name}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="label text-white">รูปภาพ Showcase</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="input input-bordered flex-1"
                              value={editingCategory.showcaseImage}
                              onChange={(e) => setEditingCategory({
                                ...editingCategory,
                                showcaseImage: e.target.value
                              })}
                              placeholder="เลือกจาก R2 หรือใส่ URL"
                              readOnly
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={openImagePicker}
                            >
                              เลือกภาพ
                            </button>
                          </div>
                          {editingCategory.showcaseImage && (
                            <div className="mt-2">
                              <img 
                                src={editingCategory.showcaseImage} 
                                alt="Preview"
                                className="w-32 h-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="label text-white">คำอธิบาย Showcase</label>
                          <textarea
                            className="textarea textarea-bordered w-full"
                            rows={2}
                            value={editingCategory.showcaseDescription}
                            onChange={(e) => setEditingCategory({
                              ...editingCategory,
                              showcaseDescription: e.target.value
                            })}
                            placeholder="คำอธิบายที่จะแสดงใน showcase..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => saveCategory(editingCategory)}
                            disabled={saving}
                          >
                            {saving ? <span className="loading loading-spinner loading-xs"></span> : "บันทึก"}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditingCategory(null)}
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {cat.showcaseImage && (
                            <img 
                              src={cat.showcaseImage} 
                              alt={cat.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="text-white font-semibold">{cat.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {cat.showcaseDescription || "ยังไม่ได้ตั้งค่าคำอธิบาย"}
                            </p>
                          </div>
                        </div>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingCategory({
                            ...cat,
                            showcaseImage: cat.showcaseImage || "",
                            showcaseDescription: cat.showcaseDescription || ""
                          })}
                        >
                          แก้ไข
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Posts Tab */}
          {activeTab === "featured" && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                เลือกโพสต์ที่จะแสดงในส่วน "ไฮไลท์ประจำสัปดาห์" (ลำดับ 1 = โพสต์ใหญ่ด้านซ้าย)
              </p>
              
              {[0, 1, 2].map((index) => (
                <div key={index} className="bg-neutral-800 rounded-lg p-4">
                  <label className="label text-white">
                    ตำแหน่งที่ {index + 1} {index === 0 && "(โพสต์หลัก)"}
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={featuredSettings.postIds[index] || ""}
                    onChange={(e) => {
                      const newIds = [...featuredSettings.postIds];
                      newIds[index] = e.target.value;
                      setFeaturedSettings({ postIds: newIds });
                    }}
                  >
                    <option value="">-- ไม่ระบุ (ใช้ค่าเริ่มต้น) --</option>
                    {posts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              
              <button
                className="btn btn-primary"
                onClick={saveFeaturedSettings}
                disabled={saving}
              >
                {saving ? <span className="loading loading-spinner loading-xs"></span> : "บันทึกการตั้งค่า"}
              </button>
            </div>
          )}

          {/* Hero Section Tab */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                เลือกโพสต์ที่จะแสดงใน Hero Section หน้าแรก
              </p>
              
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={heroSettings.useLatest}
                      onChange={(e) => setHeroSettings({
                        ...heroSettings,
                        useLatest: e.target.checked
                      })}
                    />
                    <span className="label-text text-white">
                      ใช้โพสต์ล่าสุดเสมอ (แนะนำ)
                    </span>
                  </label>
                </div>
                
                {!heroSettings.useLatest && (
                  <div className="mt-4">
                    <label className="label text-white">เลือกโพสต์สำหรับ Hero</label>
                    <select
                      className="select select-bordered w-full"
                      value={heroSettings.postId || ""}
                      onChange={(e) => setHeroSettings({
                        ...heroSettings,
                        postId: e.target.value || null
                      })}
                    >
                      <option value="">-- เลือกโพสต์ --</option>
                      {posts.map((post) => (
                        <option key={post.id} value={post.id}>
                          {post.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <button
                className="btn btn-primary"
                onClick={saveHeroSettings}
                disabled={saving}
              >
                {saving ? <span className="loading loading-spinner loading-xs"></span> : "บันทึกการตั้งค่า"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* R2 Image Picker Modal */}
      {showImagePicker && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl bg-neutral-900">
            <h3 className="font-bold text-lg text-white mb-4">เลือกรูปภาพจาก R2</h3>
            
            {loadingFiles ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg text-primary"></div>
              </div>
            ) : r2Files.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                ไม่พบรูปภาพใน R2 Storage
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {r2Files.map((file) => (
                  <div
                    key={file.key}
                    className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                    onClick={() => selectImage(file.url)}
                  >
                    <img
                      src={file.url}
                      alt={file.key}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-1 bg-neutral-800">
                      <p className="text-xs text-gray-400 truncate">{file.key}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => setShowImagePicker(false)}
              >
                ปิด
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => setShowImagePicker(false)}></div>
        </div>
      )}
    </div>
  );
}
