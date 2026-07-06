import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContent, publishDraft, updateDraft, updatePublished, } from "../services/contentService";
import { getDefaultImages } from "../services/imageService";
import { ContentDetail, UpdateContentRequest } from "../types/content";
import { DefaultImage } from "../types/image";
import EditContentSection from "../components/content/forms/EditContentSection";
import EditCoverImageField from "../components/content/forms/EditCoverImageField";
import EditContentBasicFields from "../components/content/forms/EditContentBasicFields";
import EditContentActions from "../components/content/forms/EditContentActions";
import { validateContentForm } from "../utils/contentValidation";
import { useEditContentSections } from "../hooks/content/useEditContentSections";
import { useEditCoverImage } from "../hooks/content/useEditCoverImage";
import { useEditContentForm } from "../hooks/content/useEditContentForm";

type UpdateOperation = (
  id: number,
  request: UpdateContentRequest,
  token: string
) => Promise<unknown>;

export default function EditContentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<ContentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [images, setImages] = useState<DefaultImage[]>([]);
    
    const {
        initializeForm,
        categoryId,
        setCategoryId,
        visibilityStatus,
        setVisibilityStatus,
        title,
        setTitle,
        description,
        setDescription,
    } = useEditContentForm();

    const {
        sections,
        initializeSections,
        updateSectionTitle,
        updateSectionDescription,
        updateSectionImage,
        setSectionImageMode,
        handleSectionUpload,
        restoreOriginalSectionImage,
        addSection,
        removeSection,  
        synchronizeSectionImageModes,
        resetSectionImages,
    } = useEditContentSections(categoryId);
    
    const {
        initializeCoverImage,
        coverImageId,
        setCoverImageId,
        coverImageMode,
        setCoverImageMode,
        customCoverImageUrl,
        originalCoverImageUrl,
        hasCoverImageChanged,
        handleCoverUpload,
        restoreOriginalCoverImage,
        resetCoverImage,
    } = useEditCoverImage(categoryId);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadContent = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
            throw new Error("Not authenticated.");
            }

            const data = await getContent(Number(id), token);

            setContent(data);

            initializeForm(
                data.categoryId,
                data.visibilityStatus,
                data.title,
                data.description
            );

            initializeCoverImage(
                data.coverImageId,
                data.coverImageUrl
            );

            initializeSections(data.sections);

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

                synchronizeSectionImageModes(
                    result,
                    content.sections
                );
            } catch {
                alert("Unable to load images");
            }
        }

        if (categoryId > 0) {
            loadImages();
        }
    }, [categoryId, content]);

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

    const validateForm = (): boolean => {
        const validationError = validateContentForm({
            categoryId,
            title,
            description,
            coverImageId,
            sections,
        });

        if (validationError) {
            alert(validationError);
            return false;
        }

        return true;
    };

    const submitUpdate = async (
        operation: UpdateOperation,
        successMessage: string,
        fallbackErrorMessage: string
    ) => {
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

                await operation(Number(id), request, token);

                await loadContent();

                alert(successMessage);
            } catch (err) {
                if (err instanceof Error) {
                alert(err.message);
                } else {
                alert(fallbackErrorMessage);
                }
            } finally {
                setIsSubmitting(false);
            }
    };

    const handleSaveDraft = async () => {
        await submitUpdate(
            updateDraft,
            "Draft updated successfully.",
            "Failed to update draft."
        );
    };

    const handlePublish = async () => {
        await submitUpdate(
            publishDraft,
            "Content published successfully.",
            "Failed to publish content."
        );
    };

    const handleSaveChanges = async () => {
        await submitUpdate(
            updatePublished,
            "Content updated successfully.",
            "Failed to update published content."
        );
    };

    const handleCancel = () => {
        const confirmed = window.confirm(
            "Are you sure you want to discard your changes?"
        );

        if (confirmed) {
            navigate("/content");
        }
    };

    const handleCategoryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
            const newCategoryId = Number(event.target.value);

            if (newCategoryId === categoryId) {
                return;
            }

            setCategoryId(newCategoryId);

            resetCoverImage();
            resetSectionImages();
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

            <EditContentBasicFields
                categoryId={categoryId}
                visibilityStatus={visibilityStatus}
                title={title}
                description={description}
                onCategoryChange={handleCategoryChange}
                onVisibilityStatusChange={setVisibilityStatus}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
            />

            <EditCoverImageField
                images={images}
                coverImageId={coverImageId}
                coverImageMode={coverImageMode}
                originalCoverImageUrl={originalCoverImageUrl}
                customCoverImageUrl={customCoverImageUrl}
                hasCoverImageChanged={hasCoverImageChanged}
                onImageSelect={setCoverImageId}
                onModeChange={setCoverImageMode}
                onUpload={handleCoverUpload}
                onRestoreOriginal={restoreOriginalCoverImage}
            />

            <hr/>
            <br/>

            <button type="button" onClick={addSection}>
                Add Section
            </button>

            <h2>Sections</h2>

            {sections.map((section, index) => (
                <EditContentSection
                    key={section.id ?? index}
                    section={section}
                    index={index}
                    images={images}
                    onTitleChange={updateSectionTitle}
                    onDescriptionChange={updateSectionDescription}
                    onImageChange={updateSectionImage}
                    onImageModeChange={setSectionImageMode}
                    onImageUpload={handleSectionUpload}
                    onRestoreOriginalImage={restoreOriginalSectionImage}
                    onRemove={removeSection}
                />
            ))}

            <EditContentActions
                status={content.status}
                isSubmitting={isSubmitting}
                onCancel={handleCancel}
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
                onSaveChanges={handleSaveChanges}
            />
        </div>
    );
}