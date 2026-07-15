import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContent, publishDraft, updateDraft, updatePublished, } from "../services/contentService";
import { getDefaultImages, uploadImage } from "../services/imageService";
import { ContentDetail, UpdateContentRequest } from "../types/content";
import { DefaultImage } from "../types/image";
import EditContentSection from "../components/content/edit-content/EditContentSection";
import EditCoverImageField from "../components/content/edit-content/EditCoverImageField";
import EditContentBasicFields from "../components/content/edit-content/EditContentBasicFields";
import EditContentActions from "../components/content/edit-content/EditContentActions";
import ContentPreview from "../components/content/content-preview/ContentPreview";
import PageState from "../components/common/PageState";
import { validateContentForm } from "../utils/contentValidation";
import { useEditContentSections } from "../hooks/content/edit-content/useEditContentSections";
import { useEditCoverImage } from "../hooks/content/edit-content/useEditCoverImage";
import { useEditContentForm } from "../hooks/content/edit-content/useEditContentForm";
import "../styles/pages/EditContentPage.css";

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
    } = useEditContentSections();
    
    const {
        initializeCoverImage,
        coverImageId,
        setCoverImageId,
        coverImageFile,
        coverImageMode,
        setCoverImageMode,
        customCoverImageUrl,
        originalCoverImageUrl,
        hasCoverImageChanged,   
        handleCoverUpload,
        restoreOriginalCoverImage,
        resetCoverImage,
    } = useEditCoverImage();
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [previewContent, setPreviewContent] = useState<ContentDetail | null>(null);

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
        const timeoutId = window.setTimeout(() => {
            void loadContent();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, content]);

    const validateForm = (): boolean => {
        const validationError = validateContentForm({
            categoryId,
            title,
            description,
            coverImageId,
            coverImageFile,
            sections,
        });

        if (validationError) {
            alert(validationError);
            return false;
        }

        return true;
    };

    const getEditImageUrl = (
        imageId: number,
        customImageUrl: string,
        originalImageId: number,
        originalImageUrl: string
    ): string => {
        const defaultImage = images.find((image) => image.id === imageId);

        if (defaultImage) {
            return defaultImage.filePath;
        }

        if (imageId === originalImageId) {
            return originalImageUrl;
        }

        return customImageUrl;
    };

    const handlePreview = () => {
        if (!content) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const categoryNames: Record<number, string> = {
            1: "Experience",
            2: "Learning",
            3: "Lifestyle",
        };

        const preview: ContentDetail = {
            id: content.id,
            categoryId,
            category: categoryNames[categoryId],
            title,
            description,
            status: content.status,
            visibilityStatus,
            coverImageId,
            coverImageUrl: getEditImageUrl(
                coverImageId,
                customCoverImageUrl,
                content.coverImageId,
                originalCoverImageUrl
            ),
            sections: sections.map((section, index) => ({
                id: section.id ?? index,
                title: section.title,
                description: section.description,
                sectionImageId: section.sectionImageId,
                imageUrl: getEditImageUrl(
                    section.sectionImageId,
                    section.customImageUrl,
                    section.originalImageId,
                    section.originalImageUrl
                ),
            })),
        };

        setPreviewContent(preview);
    };

    const uploadPendingImages = async (
        token: string
    ): Promise<UpdateContentRequest> => {
        let finalCoverImageId = coverImageId;

        if (coverImageFile) {
            const result = await uploadImage(
                coverImageFile,
                categoryId,
                token
            );

            finalCoverImageId = result.id;
        }

        const finalSections = [];

        for (const section of sections) {
            let sectionImageId = section.sectionImageId;

            if (section.imageFile) {
                const result = await uploadImage(
                    section.imageFile,
                    categoryId,
                    token
                );

                sectionImageId = result.id;
            }

            finalSections.push({
                id: section.id,
                title: section.title,
                description: section.description,
                sectionImageId,
            });
        }

        return {
            categoryId,
            visibilityStatus,
            title,
            description,
            coverImageId: finalCoverImageId,
            sections: finalSections,
        };
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

                const request = await uploadPendingImages(token);

                await operation(Number(id), request, token);

                alert(successMessage);

                navigate("/content");
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
        return (
            <PageState
            title="Loading content"
            message="Please wait while the content is being retrieved."
            />
        );
    }

    if (error) {
        return (
            <PageState
            title="Unable to load content"
            message={error}
            actionLabel="Back to Manage Content"
            onAction={() => navigate("/content")}
            />
        );
    }

    if (!content) {
        return (
            <PageState
            title="Content not found"
            message="The requested content record could not be found."
            actionLabel="Back to Manage Content"
            onAction={() => navigate("/content")}
            />
        );
    }

    if (previewContent) {
        return (
            <ContentPreview
                content={previewContent}
                onClose={() => setPreviewContent(null)}
            />
        );
    }

    return (
        <main className="edit-content-page">
            <div className="edit-content-container">
                <header className="edit-content-header">
                    <div>
                        <p className="edit-content-eyebrow">
                            Content Management
                        </p>

                        <h1>Edit Content</h1>

                        <p className="edit-content-subtitle">
                            Update the content details, images, and sections.
                        </p>
                    </div>

                    <div className="edit-content-status">
                        <span>Current Status</span>
                        <strong>{content.status}</strong>
                    </div>
                </header>

                <div className="edit-content-form">
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

                    <section className="edit-content-sections">
                        <div className="edit-content-sections-header">
                            <div>
                                <h2>Content Sections</h2>
                                <p>
                                    Add, edit, or remove sections from this content.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="edit-content-add-section"
                                onClick={addSection}
                            >
                                + Add Section
                            </button>
                        </div>

                        <div className="edit-content-sections-list">
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
                                    onRestoreOriginalImage={
                                        restoreOriginalSectionImage
                                    }
                                    onRemove={removeSection}
                                />
                            ))}
                        </div>
                    </section>

                    <EditContentActions
                        status={content.status}
                        isSubmitting={isSubmitting}
                        onPreview={handlePreview}
                        onCancel={handleCancel}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublish}
                        onSaveChanges={handleSaveChanges}
                    />
                </div>
            </div>
        </main>
    );
}