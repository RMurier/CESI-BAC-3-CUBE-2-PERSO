import { RessourceLike } from "./ressourceLike";

export interface Ressource {
    id: number;
    title: string;
    description: string;
    type: 'HTML' | 'PDF' | 'IMAGE';
    url?: string | null;
    content?: string | null;
    imagePreviewUrl?: string | null;
    createdAt: string;
    modifiedAt: string;
    isActive: boolean;
    vues: number;
    likes: RessourceLike[] | null;
  }
  