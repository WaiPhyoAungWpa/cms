import { useState } from "react";

export default function useCreateContentForm() {
    const [categoryId, setCategoryId] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [relatedContentIds, setRelatedContentIds] = useState<number[]>([]);
    const [relatedSearch, setRelatedSearch] = useState("");
    const [relatedPage, setRelatedPage] = useState(1);
    const [relatedPageSize] = useState(10);
    const [hyperlinkName, setHyperlinkName] = useState("");
    const [hyperlinkUrl, setHyperlinkUrl] = useState("");

    return {
      categoryId,
      setCategoryId,
      title,
      setTitle,
      description,
      setDescription,
      relatedContentIds,
      setRelatedContentIds,
      relatedSearch,
      setRelatedSearch,
      relatedPage,
      setRelatedPage,
      relatedPageSize,
      hyperlinkName,
      setHyperlinkName,
      hyperlinkUrl,
      setHyperlinkUrl,
    };
}