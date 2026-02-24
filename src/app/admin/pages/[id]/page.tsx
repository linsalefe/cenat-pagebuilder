"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import axios from "axios";
import { SECTIONS, TEMPLATE_DEFAULTS, SectionConfig } from "@/lib/sections";

interface Section {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export default function PageEditor() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const res = await axios.get(`http://localhost:8001/api/pages/${pageId}`);
      const page = res.data;
      setTitle(page.title);
      setSlug(page.slug);
      setTemplate(page.template);

      if (page.content?.sections?.length > 0) {
        setSections(page.content.sections);
      } else if (TEMPLATE_DEFAULTS[page.template]) {
        const defaults = TEMPLATE_DEFAULTS[page.template].map((type, i) => ({
          id: `section-${Date.now()}-${i}`,
          type,
          data: {},
        }));
        setSections(defaults);
      }
    } catch {
      console.error("Erro ao carregar página");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:8001/api/pages/${pageId}`, {
        title,
        slug,
        content: { sections },
      });
      alert("Página salva!");
    } catch {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: string) => {
    setSections([
      ...sections,
      { id: `section-${Date.now()}`, type, data: {} },
    ]);
    setShowAddMenu(false);
  };

  const removeSection = (id: string) => {
    if (!confirm("Remover esta seção?")) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newSections.length) return;
    [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
    setSections(newSections);
  };

  const updateSectionData = (id: string, key: string, value: unknown) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, data: { ...s.data, [key]: value } } : s
      )
    );
  };

  const addListItem = (sectionId: string, key: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const list = (section.data[key] as Record<string, unknown>[]) || [];
    updateSectionData(sectionId, key, [...list, {}]);
  };

  const updateListItem = (
    sectionId: string,
    key: string,
    index: number,
    field: string,
    value: string
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const list = [...((section.data[key] as Record<string, unknown>[]) || [])];
    list[index] = { ...list[index], [field]: value };
    updateSectionData(sectionId, key, list);
  };

  const removeListItem = (sectionId: string, key: string, index: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const list = ((section.data[key] as Record<string, unknown>[]) || []).filter(
      (_, i) => i !== index
    );
    updateSectionData(sectionId, key, list);
  };

  const getSectionConfig = (type: string): SectionConfig | undefined => {
    return SECTIONS.find((s) => s.type === type);
  };

  if (loading) return <div className="p-8 text-gray-500">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ← Voltar
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
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
            />
          </div>
        </div>

        {sections.map((section, index) => {
          const config = getSectionConfig(section.type);
          if (!config) return null;

          return (
            <div key={section.id} className="bg-white rounded-lg shadow">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                <h3 className="font-medium text-gray-800">{config.label}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {config.fields.map((field) => {
                  if (field.type === "list" && field.listFields) {
                    const list =
                      (section.data[field.key] as Record<string, unknown>[]) || [];
                    return (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        {list.map((item, i) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-md p-3 mb-2 space-y-2"
                          >
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-400">
                                #{i + 1}
                              </span>
                              <button
                                onClick={() =>
                                  removeListItem(section.id, field.key, i)
                                }
                                className="text-red-400 hover:text-red-600 text-xs cursor-pointer"
                              >
                                Remover
                              </button>
                            </div>
                            {field.listFields!.map((lf) => (
                              <div key={lf.key}>
                                <label className="block text-xs text-gray-500 mb-1">
                                  {lf.label}
                                </label>
                                {lf.type === "textarea" ? (
                                  <textarea
                                    value={(item[lf.key] as string) || ""}
                                    onChange={(e) =>
                                      updateListItem(
                                        section.id,
                                        field.key,
                                        i,
                                        lf.key,
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800"
                                  />
                                ) : (
                                  <input
                                    type={lf.type === "url" ? "url" : "text"}
                                    value={(item[lf.key] as string) || ""}
                                    onChange={(e) =>
                                      updateListItem(
                                        section.id,
                                        field.key,
                                        i,
                                        lf.key,
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem(section.id, field.key)}
                          className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer"
                        >
                          + Adicionar {field.label}
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === "image" ? (
                        <ImageUpload
                          value={(section.data[field.key] as string) || ""}
                          onChange={(url) =>
                            updateSectionData(section.id, field.key, url)
                          }
                        />
                      ) : field.type === "textarea" ? (
                        <textarea
                          value={(section.data[field.key] as string) || ""}
                          onChange={(e) =>
                            updateSectionData(section.id, field.key, e.target.value)
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                        />
                      ) : (
                        <input
                          type={
                            field.type === "url"
                              ? "url"
                              : field.type === "date"
                              ? "date"
                              : "text"
                          }
                          value={(section.data[field.key] as string) || ""}
                          onChange={(e) =>
                            updateSectionData(section.id, field.key, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 cursor-pointer"
          >
            + Adicionar Seção
          </button>

          {showAddMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 grid grid-cols-3 gap-2 p-4">
              {SECTIONS.map((s) => (
                <button
                  key={s.type}
                  onClick={() => addSection(s.type)}
                  className="p-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md text-left cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
