import { useState } from "react";

export default function useCreateContentForm() {
    const [categoryId, setCategoryId] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const resetBasicFields = () => {
      setTitle("");
      setDescription("");
    };

    return {
      categoryId,
      setCategoryId,
      title,
      setTitle,
      description,
      setDescription,
      resetBasicFields,
    };
}