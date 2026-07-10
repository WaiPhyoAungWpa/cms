import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveDraft, publishContent } from "../services/contentService";
import { getDefaultImages } from "../services/imageService";
import { DefaultImage } from "../types/image";
import { CreateContentRequest, ContentDetail } from "../types/content";
import CreateContentBasicFields from "../components/content/create-content/CreateContentBasicFields";
import CreateCoverImageField from "../components/content/create-content/CreateCoverImageField";
import CreateContentSection from "../components/content/create-content/CreateContentSection";
import CreateContentActions from "../components/content/create-content/CreateContentActions";
import ContentTemplateRenderer from "../components/content/content-detail/ContentTemplateRenderer";
import ContentPreview from "../components/content/content-preview/ContentPreview";
import useCreateContentForm from "../hooks/content/create-content/useCreateContentForm";
import useCreateContentSections from "../hooks/content/create-content/useCreateContentSections";
import useCreateCoverImage from "../hooks/content/create-content/useCreateCoverImage";
import { validateContentForm } from "../utils/contentValidation";
import "../styles/pages/CreateContentPage.css";

export default function CreateContentPage() {
    const navigate = useNavigate();

    const {
      categoryId,
      setCategoryId,
      title,
      setTitle,
      description,
      setDescription,
    } = useCreateContentForm();

    const [images, setImages] = useState<DefaultImage[]>([]);

    const {
      sections,
      handleSectionUpload,
      handleAddSection,
      updateSectionTitle,
      updateSectionDescription,
      updateSectionImage,
      updateSectionImageMode,
      removeSection,
      resetSectionImages,
    } = useCreateContentSections(categoryId);

    const {
      coverImageId,
      setCoverImageId,
      customCoverImageUrl,
      coverImageMode,
      setCoverImageMode,
      isCoverUploading,
      coverUploadProgress,
      handleCoverUpload,
      resetCoverImage,
    } = useCreateCoverImage(categoryId);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewContent, setPreviewContent] = useState<ContentDetail | null>(null);
  
    const getSelectedImageUrl = (
      imageId: number,
      customImageUrl: string
    ): string => {
      if (customImageUrl) {
        return customImageUrl;
      }

      return images.find((image) => image.id === imageId)?.filePath ?? "";
    };

    useEffect(() => {
        async function loadImages() {
          try {
              const result = await getDefaultImages(categoryId);
        
              setImages(result);
          } catch {
                alert("Unable to load images");
          }
        }

        if (categoryId > 0) {
            loadImages();
        }
    }, [categoryId]);

    const buildCreateRequest = (): CreateContentRequest => {
        return {
          categoryId,
          title,
          description,
          coverImageId,
          sections: sections.map((section) => ({
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

    const handlePublish = async () => {
        if (!validateForm()) {
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Not Authenticated.");
            return;
        }

        setIsSubmitting(true);

        try {
          const request = buildCreateRequest();   

          await publishContent(request, token);

          alert("The content has been published successfully.");
          navigate("/content");
        } catch (error) {
            if (error instanceof Error) {
              alert(error.message);
            } else {
              alert("Unable to publish content. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!validateForm()) {
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          alert("Not Authenticated.");
          return;
        }

        setIsSubmitting(true);

        try {
            const request = buildCreateRequest();

            await saveDraft(request, token);

            alert("Draft saved successfully.");
            navigate("/content");
        } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
          } else {
            alert("Unable to save draft. Please try again later.");
          }
        } finally {
          setIsSubmitting(false);
        }
    };

    const handlePreview = () => {
        if (!validateForm()) {
          return;
        }

        const categoryNames: Record<number, string> = {
          1: "Experience",
          2: "Learning",
          3: "Lifestyle",
        };

        const preview: ContentDetail = {
          id: 0,
          categoryId,
          category: categoryNames[categoryId],
          title,
          description,
          status: "Draft",
          visibilityStatus: "Private",
          coverImageId,
          coverImageUrl: getSelectedImageUrl(
            coverImageId,
            customCoverImageUrl
          ),
          sections: sections.map((section, index) => ({
            id: index,
            title: section.title,
            description: section.description,
            sectionImageId: section.sectionImageId,
            imageUrl: getSelectedImageUrl(
              section.sectionImageId,
              section.customImageUrl
            ),
          })),
        };

        setPreviewContent(preview);
    };

    const handleCancel = () => {
        const confirmed = window.confirm(
          "Are you sure you want to discard the current content?"
        );

        if (!confirmed) {
          return;
        }

        navigate("/content");
    };

    const handleCategoryChange = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
          const newCategoryId = Number(event.target.value);

          if (newCategoryId === categoryId) {
            return;
          }

          const hasCustomImages =
            customCoverImageUrl ||
            sections.some((section) => section.customImageUrl);

          if (hasCustomImages) {
            const confirmed = window.confirm(
              "Changing category will remove all uploaded custom images. Continue?"
            );

            if (!confirmed) {
              return;
            }
          }

          setCategoryId(newCategoryId);

          resetCoverImage();

          resetSectionImages();
    };

    if (previewContent) {
        return (
          <ContentPreview
            content={previewContent}
            onClose={() => setPreviewContent(null)}
          />
        );
    }

    return (
      <main className="create-content-page">
        <div className="create-content-container">
          <header className="create-content-header">
            <div>
              <p className="create-content-eyebrow">Content Management</p>
              <h1>Create Content</h1>
              <p className="create-content-subtitle">
                Create a new article, configure its images, and add content sections.
              </p>
            </div>
          </header>

          <div className="create-content-form">
            <section className="create-content-card">
              <div className="create-content-card-header">
                <span className="create-content-step">01</span>

                <div>
                  <h2>Content Details</h2>
                  <p>Choose a category and enter the main content information.</p>
                </div>
              </div>

              <CreateContentBasicFields
                categoryId={categoryId}
                title={title}
                description={description}
                onCategoryChange={handleCategoryChange}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
              />
            </section>

            <section className="create-content-card">
              <div className="create-content-card-header">
                <span className="create-content-step">02</span>

                <div>
                  <h2>Cover Image</h2>
                  <p>Select a default image or upload a custom image.</p>
                </div>
              </div>

              <CreateCoverImageField
                images={images}
                coverImageId={coverImageId}
                coverImageMode={coverImageMode}
                customCoverImageUrl={customCoverImageUrl}
                isUploading={isCoverUploading}
                uploadProgress={coverUploadProgress}
                onImageSelect={setCoverImageId}
                onModeChange={setCoverImageMode}
                onUpload={handleCoverUpload}
              />
            </section>

            <section className="create-content-card">
              <div className="create-content-card-header create-content-sections-header">
                <div className="create-content-card-title">
                  <span className="create-content-step">03</span>

                  <div>
                    <h2>Content Sections</h2>
                    <p>Add supporting sections to structure the article.</p>
                  </div>
                </div>

                <span className="create-content-section-count">
                  {sections.length} {sections.length === 1 ? "section" : "sections"}
                </span>
              </div>

              <div className="create-content-sections">
                {sections.map((section, index) => (
                  <CreateContentSection
                    key={index}
                    index={index}
                    title={section.title}
                    description={section.description}
                    sectionImageId={section.sectionImageId}
                    imageMode={section.imageMode}
                    customImageUrl={section.customImageUrl}
                    isUploading={section.isUploading}
                    uploadProgress={section.uploadProgress}
                    images={images}
                    onTitleChange={(value) => updateSectionTitle(index, value)}
                    onDescriptionChange={(value) =>
                      updateSectionDescription(index, value)
                    }
                    onImageSelect={(imageId) =>
                      updateSectionImage(index, imageId)
                    }
                    onImageModeChange={(imageMode) =>
                      updateSectionImageMode(index, imageMode)
                    }
                    onUpload={(event) => handleSectionUpload(index, event)}
                    onRemove={() => removeSection(index)}
                  />
                ))}
              </div>

              <button
                className="create-content-add-section-button"
                onClick={handleAddSection}
                disabled={isSubmitting}
              >
                + Add Section
              </button>
            </section>

            <CreateContentActions
              isSubmitting={isSubmitting}
              onPreview={handlePreview}
              onCancel={handleCancel}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
            />
          </div>
        </div>
      </main>
    );
}