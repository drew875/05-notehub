import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
    onSearch: (term: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
    const [value, setValue] = useState("");
    const [debounced] = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debounced.trim());
    }, [debounced, onSearch]);

    return (
        <div className={css.searchBox}>
            <input
                type="text"
                className={css.input}
                placeholder="Search notes"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}