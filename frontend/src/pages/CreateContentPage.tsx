import { useState } from "react";
import { saveDraft } from "../services/contentService";
import { CreateSectionRequest } from "../types/content";

export default function CreateContentPage() {
  const [categoryId, setCategoryId] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<CreateSectionRequest[]>([]);

  const handleSaveDraft = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
        alert("Please login first");
        return;
        }

        const request = {
        categoryId,
        title,
        description,
        coverImageId: 1,
        sections,
        };

        const result = await saveDraft(request, token);

        alert(`Draft saved. ID: ${result.id}`);
    } catch (error) {
        alert("Failed to save draft");
    }
    };

  const handleAddSection = () => {
    setSections([
        ...sections,
        {
        title: "",
        description: "",
        sectionImageId: 1,
        },
    ]);
    };

    const updateSectionTitle = (
        index: number,
        value: string
        ) => {
        const updated = [...sections];
        updated[index].title = value;
        setSections(updated);
    };

    const updateSectionDescription = (
        index: number,
        value: string
        ) => {
        const updated = [...sections];
        updated[index].description = value;
        setSections(updated);
    };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Content</h1>

      <div>
        <label>Category</label>
        <br />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          <option value={1}>Experience</option>
          <option value={2}>Learning</option>
          <option value={3}>Lifestyle</option>
        </select>
      </div>

      <br />

      <div>
        <label>Title</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Description</label>
        <br />
        <textarea
          rows={5}
          cols={50}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <br />

      <h2>Sections</h2>

        {sections.map((section, index) => (
        <div
            key={index}
            style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            }}
        >
            <h3>Section {index + 1}</h3>

            <div>
            <label>Section Title</label>
            <br />
            <input
                type="text"
                value={section.title}
                onChange={(e) =>
                updateSectionTitle(index, e.target.value)
                }
            />
            </div>

            <br />

            <div>
            <label>Section Description</label>
            <br />
            <textarea
                rows={4}
                cols={40}
                value={section.description}
                onChange={(e) =>
                updateSectionDescription(index, e.target.value)
                }
            />
            </div>
        </div>
        ))}

        <button onClick={handleAddSection}>
          Add Section
        </button>

        <br />
        <br />

      <button onClick={handleSaveDraft}>
        Save Draft
      </button>

      <button style={{ marginLeft: "10px" }}>Publish</button>
    </div>
  );
}