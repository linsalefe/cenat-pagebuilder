"use client";

import { useState } from "react";
import axios from "axios";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8001/api/upload/", formData);
      onChange(res.data.url);
    } catch {
      alert("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <img
          src={`http://localhost:8001${value}`}
          alt="Preview"
          className="w-full max-h-48 object-cover rounded-md"
        />
      )}
      <label className="block cursor-pointer">
        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200">
          {uploading ? "Enviando..." : value ? "Trocar imagem" : "Enviar imagem"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
