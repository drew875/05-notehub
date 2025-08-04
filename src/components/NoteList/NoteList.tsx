import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../type/note";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
}

function NoteList({ notes, onEdit }: NoteListProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });

    if (notes.length === 0) {
        return <p className={css.empty}>No notes available.</p>;
    }

    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <div className={css.actions}>
                            <button
                                type="button"
                                className={css.editButton}
                                onClick={() => onEdit(note)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className={css.deleteButton}
                                onClick={() => mutation.mutate(note.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;