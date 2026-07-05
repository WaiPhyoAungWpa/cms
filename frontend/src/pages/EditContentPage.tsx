import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getContent,
  publishDraft,
  updateDraft,
  updatePublished,
} from "../services/contentService";
import { ContentDetail, UpdateSectionRequest, UpdateContentRequest } from "../types/content";
import { getDefaultImages, uploadImage } from "../services/imageService";
import { DefaultImage } from "../types/image";
import { getImageUrl } from "../utils/image";

interface EditSection extends UpdateSectionRequest {
  imageMode: "default" | "custom";
  customImageUrl: string;
  originalImageId: number;
  originalImageUrl: string;
}

export default function EditContentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<ContentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [visibilityStatus, setVisibilityStatus] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<DefaultImage[]>([]);
    const [coverImageId, setCoverImageId] = useState(0);
    const [sections, setSections] = useState<EditSection[]>([]);
    const [customCoverImageUrl, setCustomCoverImageUrl] = useState("");
    const [coverImageMode, setCoverImageMode] = useState<"default" | "custom">("default");
    const [originalCoverImageId, setOriginalCoverImageId] = useState(0);
    const [originalCoverImageUrl, setOriginalCoverImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadContent = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
            throw new Error("Not authenticated.");
            }

            const data = await getContent(Number(id), token);

            setContent(data);

            setCategoryId(data.categoryId);
            setVisibilityStatus(data.visibilityStatus);
            setTitle(data.title);
            setDescription(data.description);
            setCoverImageId(data.coverImageId);
            setOriginalCoverImageId(data.coverImageId);
            setOriginalCoverImageUrl(data.coverImageUrl);

            setSections(
            data.sections.map((section) => ({
                id: section.id,
                title: section.title,
                description: section.description,
                sectionImageId: section.sectionImageId,
                imageMode: "default",
                customImageUrl: section.imageUrl,
                originalImageId: section.sectionImageId,
                originalImageUrl: section.imageUrl,
            }))
            );

        } catch (err) {
            if (err instanceof Error) {
            setError(err.message);
            } else {
            setError("Failed to retrieve content.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContent();
    }, [id]);
    
    useEffect(() => {
        async function loadImages() {
            if (!content) {
            return;
            }

            try {
            const result = await getDefaultImages(categoryId);

            setImages(result);

            setSections((previousSections) =>
            previousSections.map((section) => {
                const isDefaultImage = result.some(
                (image) => image.id === section.sectionImageId
                );

                const existingSection = content.sections.find(
                (contentSection) => contentSection.id === section.id
                );

                return {
                ...section,
                imageMode: isDefaultImage ? "default" : "custom",
                customImageUrl:
                    existingSection?.imageUrl ?? section.customImageUrl,
                };
            })
            );
            } catch {
            alert("Unable to load images");
            }
        }

        if (categoryId > 0) {
            loadImages();
        }
    }, [categoryId, content]);

    const selectedCoverImage = images.find(
        (image) => image.id === coverImageId
    );

    const hasCoverImageChanged = coverImageId !== originalCoverImageId;

    const handleCoverUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const result = await uploadImage(
            file,
            categoryId,
            token
            );

            setCoverImageId(result.id);
            setCustomCoverImageUrl(result.filePath);
            setCoverImageMode("custom");
        } catch {
            alert("Failed to upload image");
        }
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

    const updateSectionImage = (
        index: number,
        imageId: number
        ) => {
        const updated = [...sections];

        updated[index].sectionImageId = imageId;

        setSections(updated);
    };

    const setSectionImageMode = (
        index: number,
        mode: "default" | "custom"
        ) => {
        const updated = [...sections];

        updated[index].imageMode = mode;

        setSections(updated);
    };

    const handleSectionUpload = async (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const result = await uploadImage(
            file,
            categoryId,
            token
            );

            const updated = [...sections];

            updated[index].sectionImageId = result.id;
            updated[index].customImageUrl = result.filePath;
            updated[index].imageMode = "custom";

            setSections(updated);
        } catch {
            alert("Failed to upload image");
        }
    };

    const restoreOriginalCoverImage = () => {
        setCoverImageId(originalCoverImageId);
    };

    const restoreOriginalSectionImage = (index: number) => {
        const updated = [...sections];

        updated[index].sectionImageId =
            updated[index].originalImageId;

        setSections(updated);
    };

    const addSection = () => {
        setSections((previousSections) => [
            ...previousSections,
            {
            id: null,
            title: "",
            description: "",
            sectionImageId: 0,
            imageMode: "default",
            customImageUrl: "",
            originalImageId: 0,
            originalImageUrl: "",
            },
        ]);
    };

    const removeSection = (index: number) => {
        setSections((previousSections) =>
            previousSections.filter((_, sectionIndex) => sectionIndex !== index)
        );
    };

    const buildUpdateRequest = (): UpdateContentRequest => {
        return {
            categoryId,
            visibilityStatus,
            title,
            description,
            coverImageId,
            sections: sections.map((section) => ({
            id: section.id,
            title: section.title,
            description: section.description,
            sectionImageId: section.sectionImageId,
            })),
        };
    };

    const handleSaveDraft = async () => {
        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            setIsSubmitting(true);

            const request = buildUpdateRequest();

            await updateDraft(Number(id), request, token);

            await loadContent();

            alert("Draft updated successfully.");
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Failed to update draft.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePublish = async () => {
        if (!validateForm()) {
            return;
        }
        
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            setIsSubmitting(true);

            const request = buildUpdateRequest();

            await publishDraft(Number(id), request, token);

            await loadContent();

            alert("Content published successfully.");
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Failed to publish content.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            setIsSubmitting(true);

            const request = buildUpdateRequest();

            await updatePublished(Number(id), request, token);

            await loadContent();

            alert("Content updated successfully.");
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Failed to update published content.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        const confirmed = window.confirm(
            "Are you sure you want to discard your changes?"
        );

        if (confirmed) {
            navigate("/content");
        }
    };

    const validateForm = (): boolean => {
        if (categoryId <= 0) {
            alert("Category is required.");
            return false;
        }

        if (!title.trim()) {
            alert("Title is required.");
            return false;
        }

        if (!description.trim()) {
            alert("Description is required.");
            return false;
        }

        if (coverImageId <= 0) {
            alert("Cover image is required.");
            return false;
        }

        for (let index = 0; index < sections.length; index++) {
            const section = sections[index];

            if (!section.title.trim()) {
            alert(`Section ${index + 1} title is required.`);
            return false;
            }

            if (!section.description.trim()) {
            alert(`Section ${index + 1} description is required.`);
            return false;
            }

            if (section.sectionImageId <= 0) {
            alert(`Section ${index + 1} image is required.`);
            return false;
            }
        }

        return true;
    };

    const handleCategoryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
        ) => {
        const newCategoryId = Number(event.target.value);

        if (newCategoryId === categoryId) {
            return;
        }

        setCategoryId(newCategoryId);

        setCoverImageId(0);
        setCustomCoverImageUrl("");
        setCoverImageMode("default");

        setSections((previousSections) =>
            previousSections.map((section) => ({
            ...section,
            sectionImageId: 0,
            customImageUrl: "",
            imageMode: "default",
            }))
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!content) {
        return <p>Content not found.</p>;
    }

    return (
    <div>
        <h1>Edit Content</h1>

        <p>Status: {content.status}</p>

        <div>
            <label>Category</label>

            <select
                value={categoryId}
                onChange={handleCategoryChange}
            >
                <option value={1}>Experience</option>
                <option value={2}>Learning</option>
                <option value={3}>Lifestyle</option>
            </select>
        </div>

        <div>
            <label>Visibility Status</label>

            <select
                value={visibilityStatus}
                onChange={(event) => setVisibilityStatus(event.target.value)}
            >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
            </select>
        </div>

        <div>
            <label>Title</label>

            <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
        </div>

        <div>
            <label>Description</label>
            <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
        </div>

        <div>
            <label>Cover Photo</label>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    <input
                    type="radio"
                    checked={coverImageMode === "default"}
                    onChange={() => setCoverImageMode("default")}
                    />
                    Default Image
                </label>

                <br />

                <label>
                    <input
                    type="radio"
                    checked={coverImageMode === "custom"}
                    onChange={() => setCoverImageMode("custom")}
                    />
                    Upload Custom Image
                </label>
            </div>

            {coverImageMode === "default" && (
            <>
                <div
                    style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    marginTop: "10px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                        >
                        {images.map((image) => (
                            <div
                                key={image.id}
                                onClick={() => setCoverImageId(image.id)}
                                style={{
                                    border:
                                    coverImageId === image.id
                                        ? "3px solid green"
                                        : "1px solid #aaa",
                                    padding: "4px",
                                    cursor: "pointer",
                                }}
                                >
                                <img
                                    src={getImageUrl(image.filePath)}
                                    alt="Default"
                                    width={120}
                                    height={120}
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </>
            )}

            {coverImageMode === "custom" && (
            <>
                <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                />

                <br />
                <br />
            </>
            )}

            <hr />

            <p>Current Image</p>

            <div
                onClick={restoreOriginalCoverImage}
                style={{
                    display: "inline-block",
                    border:
                    !hasCoverImageChanged
                        ? "3px solid green"
                        : "1px solid #aaa",
                    padding: "4px",
                    cursor: "pointer",
                }}
                >
                <img
                    src={getImageUrl(originalCoverImageUrl)}
                    width={250}
                    alt="Current Cover"
                />
            </div>
            {hasCoverImageChanged && (
            <>
                <p>New Selected Image</p>

                {selectedCoverImage ? (
                <img
                    src={getImageUrl(selectedCoverImage.filePath)}
                    width={250}
                    alt="New Selected Cover"
                />
                ) : customCoverImageUrl ? (
                <img
                    src={getImageUrl(customCoverImageUrl)}
                    width={250}
                    alt="New Selected Cover"
                />
                ) : null}
            </>
            )}
        </div>

        <hr/>
        <br/>

        <button type="button" onClick={addSection}>
            Add Section
        </button>

        <h2>Sections</h2>

        {sections.map((section, index) => {
            const selectedSectionImage = images.find(
                (image) => image.id === section.sectionImageId
            );

            const isNewSection = section.id === null;

            const hasSectionImageChanged = section.sectionImageId !== section.originalImageId;

            const existingSection = content.sections.find(
                (contentSection) => contentSection.id === section.id
            );

            return (
                <div
                    key={section.id ?? index}
                    style={{
                        border: "1px solid #ccc",
                        padding: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                        >
                        <h3>Section {index + 1}</h3>

                        <button
                            type="button"
                            onClick={() => removeSection(index)}
                        >
                            Remove Section
                        </button>
                    </div>

                    <div>
                        <label>Section Title</label>

                        <br />

                        <input
                        type="text"
                        value={section.title}
                        onChange={(event) =>
                            updateSectionTitle(index, event.target.value)
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
                        onChange={(event) =>
                            updateSectionDescription(index, event.target.value)
                        }
                        />
                    </div>

                    <br />

                    <div>
                        <label>Section Image</label>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>
                                <input
                                type="radio"
                                checked={section.imageMode === "default"}
                                onChange={() =>
                                setSectionImageMode(index, "default")
                                }
                                />
                                Default Image
                            </label>

                            <br />

                            <label>
                                <input
                                type="radio"
                                checked={section.imageMode === "custom"}
                                onChange={() =>
                                setSectionImageMode(index, "custom")
                                }
                                />
                                Upload Custom Image
                            </label>
                        </div>

                        {section.imageMode === "default" && (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    marginTop: "10px",
                                }}
                                >
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        onClick={() =>
                                            updateSectionImage(index, image.id)
                                        }
                                        style={{
                                            border:
                                            section.sectionImageId === image.id
                                                ? "3px solid green"
                                                : "1px solid #aaa",
                                            padding: "4px",
                                            cursor: "pointer",
                                        }}
                                        >
                                        <img
                                            src={getImageUrl(image.filePath)}
                                            width={100}
                                            height={100}
                                            alt="Default"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                        )}

                        {section.imageMode === "custom" && (
                        <>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                handleSectionUpload(index, event)
                            }
                            />

                            <br />
                            <br />
                        </>
                        )}
                        {!isNewSection && (
                        <>
                            <hr />

                            <p>Current Image</p>

                            <div
                                onClick={() => restoreOriginalSectionImage(index)}
                                style={{
                                    display: "inline-block",
                                    border: !hasSectionImageChanged
                                    ? "3px solid green"
                                    : "1px solid #aaa",
                                    padding: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={getImageUrl(section.originalImageUrl)}
                                    width={200}
                                    alt="Current Section"
                                />
                            </div>
                        </>
                        )}

                        {section.sectionImageId > 0 && (isNewSection || hasSectionImageChanged) && (
                        <>
                            <p>New Selected Image</p>

                            {selectedSectionImage ? (
                            <img
                                src={getImageUrl(selectedSectionImage.filePath)}
                                width={200}
                                alt="New Selected Section"
                            />
                            ) : section.customImageUrl ? (
                            <img
                                src={getImageUrl(section.customImageUrl)}
                                width={200}
                                alt="New Selected Section"
                            />
                            ) : null}
                        </>
                        )}
                    </div>
                </div>
                );
        })}

        <div
            style={{
                display: "flex",
                gap: "10px",
                marginTop: "2rem",
            }}
        >
            <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
            >
                Cancel
            </button>

            {content.status === "Draft" && (
                <>
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Save as Draft"}
                </button>

                <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Publish"}
                </button>
                </>
            )}

            {content.status === "Published" && (
                <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
                >
                {isSubmitting ? "Processing..." : "Save Changes"}
                </button>
            )}
        </div>
    </div>
    );
}