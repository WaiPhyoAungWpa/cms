import { useState } from "react";

export function useEditContentForm() {
    const [categoryId, setCategoryId] = useState(0);
    const [visibilityStatus, setVisibilityStatus] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const initializeForm = (
        initialCategoryId: number,
        initialVisibilityStatus: string,
        initialTitle: string,
        initialDescription: string
    ) => {
        setCategoryId(initialCategoryId);
        setVisibilityStatus(initialVisibilityStatus);
        setTitle(initialTitle);
        setDescription(initialDescription);
    };

    return {
        categoryId,
        setCategoryId,
        visibilityStatus,
        setVisibilityStatus,
        title,
        setTitle,
        description,
        setDescription,
        initializeForm,
    };
}