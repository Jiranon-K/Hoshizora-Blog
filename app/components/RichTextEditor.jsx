"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { getImageUrl } from "@/lib/helpers";
import YouTube, { getYoutubeEmbedUrl } from "./extensions/YouTubeExtension";
import Twitter, { getTweetId } from "./extensions/TwitterExtension";
import toast from "react-hot-toast";

const ImageSelectorModal = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("full");
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/r2-files");
      const data = await response.json();
      const formattedImages = Array.isArray(data)
        ? data.map((file) => ({
            name: file.key,
            url: file.url,
          }))
        : [];
      setImages(formattedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", uploadFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "อัพโหลดล้มเหลว");
      }

      setImages([{ name: uploadFile.name, url: data.url }, ...images]);

      setUploadFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("อัพโหลดรูปภาพสำเร็จ");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`อัพโหลดล้มเหลว: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-light tracking-tight text-white">
            จัดการรูปภาพ
          </h3>
        </div>

        {/* อัพโหลดรูปภาพ */}
        <div className="p-6 border-b border-zinc-800">
          <h4 className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-4">
            อัพโหลดรูปภาพใหม่
          </h4>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-transparent border border-zinc-800 text-zinc-400 font-light py-2 px-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-800 file:text-zinc-300 file:font-light hover:file:bg-zinc-700 transition-colors cursor-pointer"
                ref={fileInputRef}
              />
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="mt-3 w-full bg-white text-black font-light py-2.5 hover:bg-zinc-200 transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                type="button"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังอัพโหลด...
                  </span>
                ) : (
                  "อัพโหลดรูปภาพ"
                )}
              </button>
            </div>

            {/* ตัวอย่างรูปภาพ */}
            {previewUrl && (
              <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="ตัวอย่าง"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Layout Selector */}
        <div className="p-6 border-b border-zinc-800">
          <h4 className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-4">
            เลือก Layout รูปภาพ
          </h4>
          <div className="flex gap-3 flex-wrap">
            {[
              { id: "full", label: "เต็มความกว้าง", icon: "▣" },
              { id: "left", label: "ชิดซ้าย", icon: "◧" },
              { id: "right", label: "ชิดขวา", icon: "◨" },
              { id: "grid-2", label: "Grid 2 คอลัมน์", icon: "▦" },
            ].map((layout) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => setSelectedLayout(layout.id)}
                className={`px-4 py-2 border font-light text-sm transition-colors ${
                  selectedLayout === layout.id
                    ? "border-white text-white bg-zinc-800"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="mr-2">{layout.icon}</span>
                {layout.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <h4 className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-4">
            รูปภาพที่มีอยู่
          </h4>
          {loading ? (
            <div className="flex justify-center p-8">
              <svg
                className="animate-spin h-8 w-8 text-zinc-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : images.length === 0 ? (
            <div className="border border-zinc-800 p-8 text-center text-zinc-500 font-light">
              ยังไม่มีรูปภาพที่อัพโหลด
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image) => (
                <div
                  key={image.url}
                  onClick={() => onSelectImage(image.url, selectedLayout)}
                  className="aspect-square border border-zinc-800 overflow-hidden cursor-pointer hover:border-white transition-colors"
                >
                  <img
                    src={getImageUrl(image.url)}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full border border-zinc-700 text-zinc-400 font-light py-2.5 hover:bg-zinc-900 hover:text-white transition-colors"
            type="button"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

//  YouTube Modal
const YouTubeModal = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const handleInsert = () => {
    const embedUrl = getYoutubeEmbedUrl(url);
    if (!embedUrl) {
      setError(true);
      return;
    }
    onInsert(url);
    setUrl("");
    setError(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-6">
        <h3 className="text-xl font-light tracking-tight text-white mb-6">
          เพิ่มวิดีโอ YouTube
        </h3>

        <div>
          <div className="mb-6">
            <label className="text-xs font-medium tracking-widest uppercase text-zinc-500 block mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-b ${error ? "border-red-500" : "border-zinc-800"} text-white font-light py-3 outline-none focus:border-white transition-colors placeholder:text-zinc-700`}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {error && (
              <p className="text-red-400 text-sm font-light mt-2">
                โปรดใส่ URL ของ YouTube ที่ถูกต้อง
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-zinc-700 text-zinc-400 font-light hover:bg-zinc-900 hover:text-white transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="px-6 py-2.5 bg-white text-black font-light hover:bg-zinc-200 transition-colors"
            >
              เพิ่ม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Link Modal
const LinkModal = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const handleInsert = () => {
    if (!url || !url.startsWith("http")) {
      setError(true);
      return;
    }
    onInsert(url);
    setUrl("");
    setError(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-6">
        <h3 className="text-xl font-light tracking-tight text-white mb-6">
          เพิ่มลิงก์
        </h3>

        <div>
          <div className="mb-6">
            <label className="text-xs font-medium tracking-widest uppercase text-zinc-500 block mb-2">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-b ${error ? "border-red-500" : "border-zinc-800"} text-white font-light py-3 outline-none focus:border-white transition-colors placeholder:text-zinc-700`}
              placeholder="https://example.com"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm font-light mt-2">
                โปรดใส่ URL ที่ถูกต้อง (เริ่มต้นด้วย http:// หรือ https://)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-zinc-700 text-zinc-400 font-light hover:bg-zinc-900 hover:text-white transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="px-6 py-2.5 bg-white text-black font-light hover:bg-zinc-200 transition-colors"
            >
              เพิ่ม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Twitter Modal
const TwitterModal = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const handleInsert = () => {
    const tweetData = getTweetId(url);
    if (!tweetData) {
      setError(true);
      return;
    }
    onInsert(url);
    setUrl("");
    setError(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-6">
        <h3 className="text-xl font-light tracking-tight text-white mb-6">
          เพิ่ม Twitter/X Post
        </h3>

        <div>
          <div className="mb-6">
            <label className="text-xs font-medium tracking-widest uppercase text-zinc-500 block mb-2">
              Twitter/X URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-b ${error ? "border-red-500" : "border-zinc-800"} text-white font-light py-3 outline-none focus:border-white transition-colors placeholder:text-zinc-700`}
              placeholder="https://twitter.com/username/status/..."
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm font-light mt-2">
                โปรดใส่ URL ของ Twitter/X ที่ถูกต้อง
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-zinc-700 text-zinc-400 font-light hover:bg-zinc-900 hover:text-white transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="px-6 py-2.5 bg-white text-black font-light hover:bg-zinc-200 transition-colors"
            >
              เพิ่ม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// แถบเครื่องมือสำหรับ Editor
const MenuBar = ({
  editor,
  onImageClick,
  onYouTubeClick,
  onLinkClick,
  onTwitterClick,
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar bg-zinc-900 p-2 rounded-t-lg border-b border-zinc-800 flex flex-wrap gap-1 mb-0">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("bold") ? "bg-zinc-800 text-white" : ""}`}
        title="ตัวหนา"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("italic") ? "bg-zinc-800 text-white" : ""}`}
        title="ตัวเอียง"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("underline") ? "bg-zinc-800 text-white" : ""}`}
        title="ขีดเส้นใต้"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("strike") ? "bg-zinc-800 text-white" : ""}`}
        title="ขีดทับ"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
        </svg>
      </button>
      <div className="border-r border-zinc-700 mx-1 h-6 self-center"></div>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-zinc-800 text-white" : ""}`}
        title="หัวข้อใหญ่"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-zinc-800 text-white" : ""}`}
        title="หัวข้อรอง"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-zinc-800 text-white" : ""}`}
        title="หัวข้อย่อย"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z" />
        </svg>
      </button>
      <div className="border-r border-zinc-700 mx-1 h-6 self-center"></div>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("bulletList") ? "bg-zinc-800 text-white" : ""}`}
        title="รายการแบบจุด"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
          />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("orderedList") ? "bg-zinc-800 text-white" : ""}`}
        title="รายการแบบตัวเลข"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
          />
          <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
        </svg>
      </button>
      <div className="border-r border-zinc-700 mx-1 h-6 self-center"></div>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("left").run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-zinc-800 text-white" : ""}`}
        title="จัดชิดซ้าย"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("center").run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-zinc-800 text-white" : ""}`}
        title="จัดกึ่งกลาง"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("right").run();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-zinc-800 text-white" : ""}`}
        title="จัดชิดขวา"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <div className="border-r border-zinc-700 mx-1 h-6 self-center"></div>
      <button
        onClick={(e) => {
          e.preventDefault();
          onLinkClick();
        }}
        className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ${editor.isActive("link") ? "bg-zinc-800 text-white" : ""}`}
        title="เพิ่มลิงก์"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          onImageClick();
        }}
        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        title="เพิ่มรูปภาพ"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          onYouTubeClick();
        }}
        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        title="เพิ่มวิดีโอ YouTube"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          onTwitterClick();
        }}
        className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        title="เพิ่ม Twitter/X"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
        </svg>
      </button>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      YouTube,
      Twitter,
      Placeholder.configure({
        placeholder: placeholder || "เริ่มเขียนบทความของคุณที่นี่...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const handleSelectImage = useCallback(
    (imageUrl, layout = "full") => {
      if (editor) {
        // Insert image with layout data attribute for styling
        editor
          .chain()
          .focus()
          .setImage({
            src: imageUrl,
            "data-layout": layout,
          })
          .run();
        setIsImageSelectorOpen(false);
      }
    },
    [editor],
  );

  const handleInsertYouTube = useCallback(
    (url) => {
      if (editor) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    },
    [editor],
  );

  const handleInsertLink = useCallback(
    (url) => {
      if (editor) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    [editor],
  );

  const handleInsertTwitter = useCallback(
    (url) => {
      if (editor) {
        editor.chain().focus().setTwitterEmbed({ src: url }).run();
      }
    },
    [editor],
  );

  return (
    <div className="rich-text-editor border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/30">
      <MenuBar
        editor={editor}
        onImageClick={() => setIsImageSelectorOpen(true)}
        onYouTubeClick={() => setIsYouTubeModalOpen(true)}
        onLinkClick={() => setIsLinkModalOpen(true)}
        onTwitterClick={() => setIsTwitterModalOpen(true)}
      />
      <div className="bg-transparent">
        <EditorContent editor={editor} className="min-h-[500px] px-4 py-3" />
      </div>

      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleSelectImage}
      />

      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onInsert={handleInsertYouTube}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleInsertLink}
      />

      <TwitterModal
        isOpen={isTwitterModalOpen}
        onClose={() => setIsTwitterModalOpen(false)}
        onInsert={handleInsertTwitter}
      />

      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          max-height: 600px;
          overflow-y: auto;
          padding: 1rem;
          line-height: 1.6;
          color: #e4e4e7; /* zinc-200 */
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p {
          margin-bottom: 1.2rem;
          margin-top: 1.2rem;
        }
        .ProseMirror h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.8rem;
          margin-bottom: 0.8rem;
          color: #f4f4f5; /* zinc-100 */
        }
        .ProseMirror h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
          color: #e4e4e7; /* zinc-200 */
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
        .ProseMirror li {
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #3f3f46; /* zinc-700 */
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #a1a1aa; /* zinc-400 */
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #52525b; /* zinc-600 */
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 2rem auto;
          border-radius: 0.5rem;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        .ProseMirror div[data-youtube-video] {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 อัตราส่วน */
          height: 0;
          margin: 2.5rem auto;
          max-width: 90%;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        .ProseMirror div[data-youtube-video] iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          border: none;
        }
        .ProseMirror a {
          color: #60a5fa; /* blue-400 */
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .ProseMirror a:hover {
          color: #93c5fd; /* blue-300 */
        }
        /* สำหรับการจัดตำแหน่งข้อความ */
        .ProseMirror .text-align-left {
          text-align: left;
        }
        .ProseMirror .text-align-center {
          text-align: center;
        }
        .ProseMirror .text-align-right {
          text-align: right;
        }
        /* ปรับแต่งการแสดงโค้ด */
        .ProseMirror pre {
          background-color: #18181b; /* zinc-950 */
          border-radius: 0.375rem;
          padding: 1rem;
          margin: 1.5rem 0;
          overflow-x: auto;
          font-family: monospace;
          border: 1px solid #27272a; /* zinc-800 */
        }

        /* Twitter Embed Styles */
        .ProseMirror div[data-twitter-embed] {
          margin: 2rem auto;
          max-width: 550px;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #27272a;
          background: #09090b;
        }
        .ProseMirror div[data-twitter-embed] iframe {
          width: 100%;
          min-height: 400px;
          border: none;
        }
        .twitter-embed-container {
          position: relative;
        }

        /* Image Layout Styles */
        .ProseMirror img.editor-image {
          max-width: 100%;
          height: auto;
          margin: 2rem auto;
          border-radius: 0.5rem;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        .ProseMirror img[data-layout="full"] {
          width: 100%;
          max-width: 100%;
        }
        .ProseMirror img[data-layout="left"] {
          float: left;
          max-width: 50%;
          margin: 1rem 2rem 1rem 0;
        }
        .ProseMirror img[data-layout="right"] {
          float: right;
          max-width: 50%;
          margin: 1rem 0 1rem 2rem;
        }
        .ProseMirror img[data-layout="grid-2"] {
          display: inline-block;
          width: calc(50% - 0.5rem);
          max-width: calc(50% - 0.5rem);
          margin: 0.5rem 0.25rem;
          vertical-align: top;
        }

        /* Clear floats after floated images */
        .ProseMirror p::after {
          content: "";
          display: table;
          clear: both;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
