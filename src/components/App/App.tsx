import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchNotes, createNote, updateNote } from "../../services/noteService";
import type { Note } from "../../type/note";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { Toaster } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import css from "./App.module.css";

const PAGE_SIZE = 12;

export default function App() {
    const qc = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<Note | null>(null);

    const createMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
    });

    const updateMutation = useMutation({
        mutationFn: updateNote,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
    });

    const { data, isLoading, isError } = useQuery<{
        data: Note[];
        totalPages: number;
    }>({
        queryKey: ["notes", page, debouncedSearch],
        queryFn: () => fetchNotes(page, PAGE_SIZE, debouncedSearch),
        staleTime: 5000,
        placeholderData: (prev) => prev,
    });

    const handleSearch = (term: string) => {
        if (search !== term) {
            setPage(1);
        }
        setSearch(term);
    };
    const handleSave = async (values: {
        title: string;
        content: string;
        tag: Note["tag"];
    }) => {
        if (selected) {
            await updateMutation.mutateAsync({ id: String(selected.id), ...values });
        } else {
            await createMutation.mutateAsync(values);
        }
        setModalOpen(false);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className={css.app}>
            <Toaster position="top-right" />
            <header className={css.toolbar}>
                <SearchBox onSearch={handleSearch} />
                {data && data.totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        pageCount={data.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
                <button
                    className={css.createBtn}
                    onClick={() => {
                        setSelected(null);
                        setModalOpen(true);
                    }}
                >
                    Create note +
                </button>
            </header>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Error occurred</p>}

            {data && (
                <NoteList
                    notes={data.data}
                    onEdit={(note) => {
                        setSelected(note);
                        setModalOpen(true);
                    }}
                />
            )}

            {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <NoteForm
                        initial={selected}
                        onClose={() => setModalOpen(false)}
                        onSave={handleSave}
                    />
                </Modal>
            )}
        </div>
    );
}