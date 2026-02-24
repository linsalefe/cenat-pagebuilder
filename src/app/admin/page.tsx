"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Page {
  id: number;
  title: string;
  slug: string;
  template: string;
  is_published: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/pages/");
      setPages(res.data);
    } catch {
      console.error("Erro ao buscar páginas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await axios.delete(`http://localhost:8001/api/pages/${id}`);
    fetchPages();
  };

  const handleDuplicate = async (id: number) => {
    await axios.post(`http://localhost:8001/api/pages/${id}/duplicate`);
    fetchPages();
  };

  const handleTogglePublish = async (page: Page) => {
    await axios.put(`http://localhost:8001/api/pages/${page.id}`, {
      is_published: !page.is_published,
    });
    fetchPages();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">CENAT Page Builder</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/admin/login");
            }}
            className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Páginas</h2>
          <button
            onClick={() => router.push("/admin/pages/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Nova Página
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : pages.length === 0 ? (
          <p className="text-gray-500">Nenhuma página criada ainda.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 text-sm text-gray-800">{page.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{page.template}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          page.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {page.is_published ? "Publicada" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => router.push(`/admin/pages/${page.id}`)}
                        className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleTogglePublish(page)}
                        className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                      >
                        {page.is_published ? "Despublicar" : "Publicar"}
                      </button>
                      <button
                        onClick={() => handleDuplicate(page.id)}
                        className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                      >
                        Duplicar
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
