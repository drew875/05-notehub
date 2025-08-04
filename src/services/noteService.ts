import axios from "axios";
import type { Note } from "../type/note";

const BASE = "https://notehub-public.goit.study/api";
const client = axios.create({
    baseURL: BASE,
});

client.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_NOTEHUB_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface FetchNotesResponse {
    data: Note[];
    totalPages: number;
}

export async function fetchNotes(
    page: number,
    perPage = 12,
    search?: string
): Promise<FetchNotesResponse> {
    const params: { page: number; perPage: number; search?: string } = {
        page,
        perPage,
    };
    if (search) params.search = search;

    const resp = await client.get<{ notes: Note[]; totalPages: number }>(
        "/notes",
        { params }
    );

    return {
        data: resp.data.notes,
        totalPages: resp.data.totalPages,
    };
}

export async function createNote(input: {
    title: string;
    content: string;
    tag: Note["tag"];
}): Promise<Note> {
    const resp = await client.post<Note>("/notes", input);
    return resp.data;
}

export async function deleteNote(id: number): Promise<Note> {
    const resp = await client.delete<Note>(`/notes/${id}`);
    return resp.data;
}

export async function updateNote(input: {
    id: string;
    title: string;
    content: string;
    tag: Note["tag"];
}): Promise<Note> {
    const { id, ...data } = input;
    const resp = await client.patch<Note>(`/notes/${id}`, data);
    return resp.data;
}