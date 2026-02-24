"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const TEMPLATES = [
  { value: "pos-graduacao", label: "Pós-Graduação" },
  { value: "congresso", label: "Congresso" },
  { value: "intercambio", label: "Intercâmbio" },
  { value: "obrigado", label: "Página de Obrigado" },
];

export default function NewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("");
  const [error, setError] = useState("");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!template) {
      setError("Selecione um template");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8001/api/pages/", {
        title,
        slug,
        template,
        content: {},
      });
      router.push(`/admin/pages/${res.data.id}`);
    } catch {
      setError("Erro ao criar página. Verifique se o slug já existe.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ← Voltar
          </button>
          <h1 className="text-xl font-bold text-gray-800">Nova Página</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTemplate(t.value)}
                  className={`p-4 border-2 rounded-lg text-center cursor-pointer transition ${
                    template === t.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Página
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Pós-Graduação Psicologia Clínica 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">cenatsaudemental.com/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Criar e Editar
          </button>
        </form>
      </main>
    </div>
  );
}
