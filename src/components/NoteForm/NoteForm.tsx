import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as yup from "yup";
import type { Note } from "../../type/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote } from "../../services/noteService";

export interface NoteFormProps {
    initial?: Note | null;
    onClose: () => void;
    onSave: (values: {
        title: string;
        content: string;
        tag: Note["tag"];
    }) => Promise<void>;
}
const validationSchema = yup.object({
    title: yup
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title must be 50 characters or less")
        .required("Title is required"),
    content: yup.string().max(500, "Content must be 500 characters or less"),
    tag: yup
        .mixed<Note["tag"]>()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
        .required("Tag is required"),
});

export default function NoteForm({ initial, onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values: {
            title: string;
            content: string;
            tag: Note["tag"];
        }) => {
            if (initial) {
                return updateNote({ id: String(initial.id), ...values });
            } else {
                return createNote(values);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
    });

    const initialValues = initial
        ? {
            title: initial.title,
            content: initial.content,
            tag: initial.tag,
        }
        : {
            title: "",
            content: "",
            tag: "Todo" as Note["tag"],
        };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
                mutation.mutate(values, {
                    onSettled: () => setSubmitting(false),
                });
            }}
        >
            {({ isSubmitting }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field id="title" name="title" className={css.input} />
                        <FormikError name="title">
                            {(msg) => <span className={css.error}>{msg}</span>}
                        </FormikError>
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            as="textarea"
                            id="content"
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <FormikError name="content">
                            {(msg) => <span className={css.error}>{msg}</span>}
                        </FormikError>
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field as="select" id="tag" name="tag" className={css.select}>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <FormikError name="tag">
                            {(msg) => <span className={css.error}>{msg}</span>}
                        </FormikError>
                    </div>

                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting}
                        >
                            {initial ? "Update note" : "Create note"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}