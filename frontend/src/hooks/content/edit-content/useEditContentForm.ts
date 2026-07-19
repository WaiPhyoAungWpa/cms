import { useState } from "react";

export function useEditContentForm() {
    const [categoryId, setCategoryId] = useState(0);
    const [visibilityStatus, setVisibilityStatus] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [hyperlinkName, setHyperlinkName] = useState("");
    const [hyperlinkUrl, setHyperlinkUrl] = useState("");

    const initializeForm = (
        initialCategoryId: number,
        initialVisibilityStatus: string,
        initialTitle: string,
        initialDescription: string,
        initialHyperlinkName: string,
        initialHyperlinkUrl: string
    ) => {
        setCategoryId(initialCategoryId);
        setVisibilityStatus(initialVisibilityStatus);
        setTitle(initialTitle);
        setDescription(initialDescription);
        setHyperlinkName(initialHyperlinkName);
        setHyperlinkUrl(initialHyperlinkUrl);
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
        hyperlinkName,
        setHyperlinkName,
        hyperlinkUrl,
        setHyperlinkUrl,
        initializeForm,
    };
}