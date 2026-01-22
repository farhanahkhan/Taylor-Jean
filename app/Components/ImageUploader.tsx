"use client";

import Image from "next/image";
import React, { useState } from "react";

interface ImageUploaderProps {
  onUploadSuccess?: (url: string) => void;
}

const R2_PUBLIC_BASE_URL =
  "https://pub-a282791a5a174e8daa69fcf36a7fd132.r2.dev";

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setBannerPreview(URL.createObjectURL(selectedFile));
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first");

    setLoading(true);
    setUploadStatus("Getting signed URL...");

    try {
      const safeFileName = encodeURIComponent(file.name.replace(/\s/g, "_"));
      const contentType = file.type;

      // 1️⃣ Get presigned URL from backend
      const res = await fetch(
        `/api/uploads/generate-upload-url?fileName=${encodeURIComponent(
          safeFileName
        )}&contentType=${encodeURIComponent(contentType)}`
      );

      if (!res.ok) throw new Error("Failed to get upload URL");

      const data = await res.json();
      console.log(data);
      // debugger;
      const presignedUrl: string = data?.uploadUrl;

      setUploadStatus("Uploading to Cloudflare R2...");

      // 2️⃣ Upload to R2 using presigned URL
      // debugger;
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType, // must match signed URL
        },
      });

      if (!uploadRes.ok) throw new Error("Upload failed on R2");

      const finalImageUrl = `${R2_PUBLIC_BASE_URL}/${safeFileName}`;

      setUploadStatus("✅ Upload successful!");
      onUploadSuccess?.(finalImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("❌ Upload failed. Check CORS or file type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          id="banner-upload"
          accept="image/*"
          onChange={handleBannerSelect}
          className="hidden"
        />
        <label
          htmlFor="banner-upload"
          className="relative flex flex-col items-center justify-center h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden"
        >
          {bannerPreview ? (
            <Image
              src={bannerPreview}
              alt="Banner preview"
              fill
              className="object-cover"
            />
          ) : (
            <>
              <Image
                src="/generic-image-icon.png"
                alt="Upload"
                width={32}
                height={32}
                className="mb-2"
              />
              <p className="text-sm font-medium text-slate-600">
                Click to upload banner
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Optimal size: 1200×600px
              </p>
            </>
          )}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-dark-navy text-white rounded disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload Banner"}
      </button>

      {uploadStatus && <p className="text-sm text-slate-600">{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploader;
