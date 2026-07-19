import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveDraft, publishContent, getRelatedContentOptions } from "../services/contentService";
import { getDefaultImages, uploadImage } from "../services/imageService";
import { DefaultImage } from "../types/image";
import { CreateContentRequest, ContentDetail, RelatedContentResponse } from "../types/content";
import CreateContentBasicFields from "../components/content/create-content/CreateContentBasicFields";
import CreateCoverImageField from "../components/content/create-content/CreateCoverImageField";
import CreateContentSection from "../components/content/create-content/CreateContentSection";
import CreateContentActions from "../components/content/create-content/CreateContentActions";
import RelatedContentSelector from "../components/content/related-content/RelatedContentSelector";
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
      relatedContentIds,
      setRelatedContentIds,
      hyperlinkName,
      setHyperlinkName,
      hyperlinkUrl,
      setHyperlinkUrl,
    } = useCreateContentForm();

    const [images, setImages] = useState<DefaultImage[]>([]);

    const [relatedOptions, setRelatedOptions] = useState<RelatedContentResponse[]>([]);
    const [relatedSearch, setRelatedSearch] = useState("");
    const [relatedPage, setRelatedPage] = useState(1);
    const [relatedTotalPages, setRelatedTotalPages] = useState(1);
    const relatedPageSize = 6;

    useEffect(() => {
      async function loadRelatedOptions() {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        try {
          const result = await getRelatedContentOptions(
            token,
            relatedPage,
            relatedPageSize,
            relatedSearch
          );

          setRelatedOptions(result.items);
          setRelatedTotalPages(result.totalPages);
        } catch {
          alert("Unable to load related content.");
        }
      }

      loadRelatedOptions();
    }, [relatedPage, relatedSearch]);

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
      updateSectionHyperlinkName,
      updateSectionHyperlinkUrl,
    } = useCreateContentSections();

    const {
      coverImageId,
      setCoverImageId,
      coverImageFile,
      customCoverImageUrl,
      coverImageMode,
      updateCoverImageMode,
      handleCoverUpload,
      resetCoverImage,
    } = useCreateCoverImage();

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

    const buildCreateRequest = async (
      token: string
    ): Promise<CreateContentRequest> => {
        let finalCoverImageId = coverImageId;

        if (coverImageFile) {
            const uploaded = await uploadImage(
                coverImageFile,
                categoryId,
                token
            );

            finalCoverImageId = uploaded.id;
        }

        const requestSections: CreateContentRequest["sections"] = [];

        for (const section of sections) {

            let finalImageId = section.sectionImageId;

            if (section.imageFile) {
                const uploaded = await uploadImage(
                    section.imageFile,
                    categoryId,
                    token
                );

                finalImageId = uploaded.id;
            }

            requestSections.push({
                title: section.title,
                description: section.description,
                sectionImageId: finalImageId,
                hyperlinkName: section.hyperlinkName,
                hyperlinkUrl: section.hyperlinkUrl,
            });
        }

        return {
            categoryId,
            title,
            description,
            coverImageId: finalCoverImageId,
            relatedContentIds,
            hyperlinkName,
            hyperlinkUrl,
            sections: requestSections,
        };
    };

    const validateForm = (): boolean => {
        const validationError = validateContentForm({
            categoryId,
            title,
            description,
            coverImageId,
            coverImageFile,
            hyperlinkName,
            hyperlinkUrl,
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
          const request = await buildCreateRequest(token);

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
            const request = await buildCreateRequest(token);

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
          relatedContents: relatedOptions.filter((content) =>
            relatedContentIds.includes(content.id)
          ),
          hyperlinkName,
          hyperlinkUrl,
          sections: sections.map((section, index) => ({
            id: index,
            title: section.title,
            description: section.description,
            sectionImageId: section.sectionImageId,
            imageUrl: getSelectedImageUrl(
              section.sectionImageId,
              section.customImageUrl
            ),
            hyperlinkName: section.hyperlinkName,
            hyperlinkUrl: section.hyperlinkUrl
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
                  hyperlinkName={hyperlinkName}
                  hyperlinkUrl={hyperlinkUrl}
                  onCategoryChange={handleCategoryChange}
                  onTitleChange={setTitle}
                  onDescriptionChange={setDescription}
                  onHyperlinkNameChange={setHyperlinkName}
                  onHyperlinkUrlChange={setHyperlinkUrl}
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
                onImageSelect={setCoverImageId}
                onModeChange={updateCoverImageMode}
                onUpload={handleCoverUpload}
              />
            </section>

            <section className="create-content-card">
              <div className="create-content-card-header">
                  <span className="create-content-step">03</span>

                  <div>
                      <h2>Related Content</h2>
                      <p>
                          Search and select published content
                          related to this article.
                      </p>
                  </div>
              </div>

              <RelatedContentSelector
                  relatedOptions={relatedOptions}
                  relatedSearch={relatedSearch}
                  relatedPage={relatedPage}
                  totalRelatedPages={relatedTotalPages}
                  relatedContentIds={relatedContentIds}
                  onRelatedSearchChange={(value) => {
                      setRelatedSearch(value);
                      setRelatedPage(1);
                  }}
                  onRelatedPageChange={setRelatedPage}
                  onRelatedContentChange={setRelatedContentIds}
              />
            </section>

            <section className="create-content-card">
              <div className="create-content-card-header create-content-sections-header">
                <div className="create-content-card-title">
                  <span className="create-content-step">04</span>

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
                    hyperlinkName={section.hyperlinkName}
                    hyperlinkUrl={section.hyperlinkUrl}
                    imageMode={section.imageMode}
                    customImageUrl={section.customImageUrl}
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
                    onHyperlinkNameChange={(value) =>
                      updateSectionHyperlinkName(index, value)
                    }
                    onHyperlinkUrlChange={(value) =>
                      updateSectionHyperlinkUrl(index, value)
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