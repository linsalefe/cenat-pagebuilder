export interface SectionField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "url" | "date" | "list";
  listFields?: SectionField[];
}

export interface SectionConfig {
  type: string;
  label: string;
  fields: SectionField[];
}

export const SECTIONS: SectionConfig[] = [
  {
    type: "hero",
    label: "Hero (Banner + Título)",
    fields: [
      { key: "image", label: "Imagem do Banner", type: "image" },
      { key: "title", label: "Título", type: "text" },
      { key: "subtitle", label: "Subtítulo", type: "text" },
    ],
  },
  {
    type: "text",
    label: "Texto Livre",
    fields: [
      { key: "title", label: "Título da Seção", type: "text" },
      { key: "content", label: "Conteúdo", type: "textarea" },
    ],
  },
  {
    type: "speakers",
    label: "Corpo Docente / Palestrantes",
    fields: [
      {
        key: "items",
        label: "Palestrantes",
        type: "list",
        listFields: [
          { key: "name", label: "Nome", type: "text" },
          { key: "role", label: "Cargo", type: "text" },
          { key: "photo", label: "Foto", type: "image" },
          { key: "bio", label: "Bio", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "testimonials",
    label: "Depoimentos",
    fields: [
      {
        key: "items",
        label: "Depoimentos",
        type: "list",
        listFields: [
          { key: "name", label: "Nome", type: "text" },
          { key: "text", label: "Depoimento", type: "textarea" },
          { key: "photo", label: "Foto", type: "image" },
        ],
      },
    ],
  },
  {
    type: "schedule",
    label: "Programação",
    fields: [
      { key: "date", label: "Data", type: "date" },
      {
        key: "items",
        label: "Atividades",
        type: "list",
        listFields: [
          { key: "time", label: "Horário", type: "text" },
          { key: "title", label: "Atividade", type: "text" },
          { key: "description", label: "Descrição", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "pricing",
    label: "Investimento / Preços",
    fields: [
      { key: "title", label: "Título", type: "text" },
      {
        key: "items",
        label: "Opções",
        type: "list",
        listFields: [
          { key: "name", label: "Nome do Plano", type: "text" },
          { key: "price", label: "Preço", type: "text" },
          { key: "description", label: "Descrição", type: "textarea" },
          { key: "buttonText", label: "Texto do Botão", type: "text" },
          { key: "buttonUrl", label: "Link do Botão", type: "url" },
        ],
      },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    fields: [
      {
        key: "items",
        label: "Perguntas",
        type: "list",
        listFields: [
          { key: "question", label: "Pergunta", type: "text" },
          { key: "answer", label: "Resposta", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "video",
    label: "Vídeo",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "url", label: "URL do Vídeo (YouTube)", type: "url" },
    ],
  },
  {
    type: "cta",
    label: "CTA (Botão)",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "subtitle", label: "Subtítulo", type: "text" },
      { key: "buttonText", label: "Texto do Botão", type: "text" },
      { key: "buttonUrl", label: "Link do Botão", type: "url" },
    ],
  },
  {
    type: "countdown",
    label: "Contador Regressivo",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "date", label: "Data do Evento", type: "date" },
    ],
  },
  {
    type: "gallery",
    label: "Galeria de Imagens",
    fields: [
      { key: "title", label: "Título", type: "text" },
      {
        key: "items",
        label: "Imagens",
        type: "list",
        listFields: [
          { key: "image", label: "Imagem", type: "image" },
          { key: "caption", label: "Legenda", type: "text" },
        ],
      },
    ],
  },
  {
    type: "location",
    label: "Local (Endereço)",
    fields: [
      { key: "name", label: "Nome do Local", type: "text" },
      { key: "address", label: "Endereço Completo", type: "text" },
      { key: "image", label: "Imagem do Local", type: "image" },
    ],
  },
  {
    type: "form",
    label: "Formulário",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "buttonText", label: "Texto do Botão", type: "text" },
      { key: "redirectSlug", label: "Slug da Página de Obrigado", type: "text" },
    ],
  },
];

export const TEMPLATE_DEFAULTS: Record<string, string[]> = {
  "pos-graduacao": ["hero", "text", "speakers", "testimonials", "pricing", "cta"],
  "congresso": ["hero", "countdown", "text", "schedule", "speakers", "location", "cta"],
  "intercambio": ["hero", "text", "speakers", "gallery", "pricing", "cta"],
  "obrigado": ["hero", "video", "cta"],
};
