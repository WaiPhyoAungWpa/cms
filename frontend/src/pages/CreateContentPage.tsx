import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveDraft, publishContent } from "../services/contentService";
import { getDefaultImages } from "../services/imageService";
import { DefaultImage } from "../types/image";
import { CreateContentRequest } from "../types/content";
import CreateContentBasicFields from "../components/content/create-content/CreateContentBasicFields";
import CreateCoverImageField from "../components/content/create-content/CreateCoverImageField";
import CreateContentSection from "../components/content/create-content/CreateContentSection";
import CreateContentActions from "../components/content/create-content/CreateContentActions";
import useCreateContentForm from "../hooks/content/useCreateContentForm";
import useCreateContentSections from "../hooks/content/useCreateContentSections";
import useCreateCoverImage from "../hooks/content/useCreateCoverImage";
import { validateContentForm } from "../utils/contentValidation";

export default function CreateContentPage() {
    const navigate = useNavigate();

    const {
      categoryId,
      setCategoryId,
      title,
      setTitle,
      description,
      setDescription,
      resetBasicFields,
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
      resetSections,
    } = useCreateContentSections(categoryId);

    const {
      coverImageId,
      setCoverImageId,
      customCoverImageUrl,
      coverImageMode,
      setCoverImageMode,
      handleCoverUpload,
      resetCoverImage,
    } = useCreateCoverImage(categoryId);

    const [isSubmitting, setIsSubmitting] = useState(false);
  
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
          resetForm();
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
            resetForm();
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

    const handlePreview = () => {};

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

    const resetForm = () => {
      resetBasicFields();
      resetCoverImage();
      resetSections();
    };

    return (
      <div>
        <h1>Create Content</h1>

        <CreateContentBasicFields
            categoryId={categoryId}
            title={title}
            description={description}
            onCategoryChange={handleCategoryChange}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
        />

        <br />

        <CreateCoverImageField
            images={images}
            coverImageId={coverImageId}
            coverImageMode={coverImageMode}
            customCoverImageUrl={customCoverImageUrl}
            onImageSelect={setCoverImageId}
            onModeChange={setCoverImageMode}
            onUpload={handleCoverUpload}
        />

        <br />

        <h2>Sections</h2>

        {sections.map((section, index) => (
          <CreateContentSection
            key={index}
            index={index}
            title={section.title}
            description={section.description}
            sectionImageId={section.sectionImageId}
            imageMode={section.imageMode}
            customImageUrl={section.customImageUrl}
            images={images}
            onTitleChange={(value) => updateSectionTitle(index, value)}
            onDescriptionChange={(value) => updateSectionDescription(index, value)}
            onImageSelect={(imageId) => updateSectionImage(index, imageId)}
            onImageModeChange={(imageMode) => updateSectionImageMode(index, imageMode)}
            onUpload={(event) => handleSectionUpload(index, event)}
            onRemove={() => removeSection(index)}
          />
        ))}

        <button 
            onClick={handleAddSection} 
            disabled={isSubmitting}
          >
            Add Section
        </button>

        <br/>

        <CreateContentActions
          isSubmitting={isSubmitting}
          onPreview={handlePreview}
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
        />
      </div>
    );
}