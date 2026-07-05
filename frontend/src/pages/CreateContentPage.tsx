import { useEffect, useState } from "react";
import { saveDraft, publishContent } from "../services/contentService";
import { CreateSectionRequest } from "../types/content";
import { getDefaultImages, uploadImage } from "../services/imageService";
import { DefaultImage } from "../types/image";
import { getImageUrl } from "../utils/image";

export default function CreateContentPage() {
  const [categoryId, setCategoryId] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageId, setCoverImageId] = useState(1);
  const [sections, setSections] = useState<CreateSectionRequest[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [images, setImages] = useState<DefaultImage[]>([]);
  const [customCoverImageUrl, setCustomCoverImageUrl] = useState("");
  const [useCustomCover, setUseCustomCover] = useState(false);

  useEffect(() => {
      loadImages(categoryId);
    }, [categoryId]);

    const loadImages = async (categoryId: number) => {
      try {
        const result = await getDefaultImages(categoryId);

        setImages(result);

        if (result.length > 0) {
          setCoverImageId(result[0].id);

          setSections(prev =>
              prev.map(section => ({
                  ...section,
                  sectionImageId: result[0].id
              }))
          );
        }
      } catch {
        alert("Unable to load images");
      }
    };

    const selectedCoverImage = images.find(
      image => image.id === coverImageId
      );

  const handlePublish = async () => {
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
        coverImageId,
        sections,
      };

      const result = await publishContent(
        request,
        token
      );

      alert(
        `Content published. ID: ${result.id}`
      );
    } catch {
      alert("Failed to publish content");
    }
  };

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
        coverImageId,
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
        sectionImageId: images.length > 0 ? images[0].id : 0,
        useCustomImage: false,
        customImageUrl: "",
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

    const updateSectionImage = (
        index: number,
        imageId: number
      ) => {
        const updated = [...sections];
        updated[index].sectionImageId = imageId;
        setSections(updated);
      };

    const handleCoverUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = e.target.files?.[0];

        if (!file) return;

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
          setUseCustomCover(true);
        } catch {
          alert("Failed to upload image");
        }
      };

    const handleSectionUpload = async (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = e.target.files?.[0];

      if (!file) return;

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
        updated[index].useCustomImage = true;

        setSections(updated);
      } catch {
        alert("Failed to upload image");
      }
    };

    const toggleSectionImageType = (
      index: number,
      useCustom: boolean
    ) => {
      const updated = [...sections];

      updated[index].useCustomImage = useCustom;

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
          onChange={(e) => {
            const selectedCategory = Number(e.target.value);

            // Optional warning if custom images already exist
            if (
              useCustomCover ||
              sections.some(section => section.useCustomImage)
            ) {
              const confirmed = window.confirm(
                "Changing category will remove all uploaded custom images. Continue?"
              );

              if (!confirmed) {
                return;
              }
            }

            setCategoryId(selectedCategory);

            // Reset cover image
            setUseCustomCover(false);
            setCustomCoverImageUrl("");
            setCoverImageId(0);

            // Reset all section images
            setSections(prev =>
              prev.map(section => ({
                ...section,
                sectionImageId: 0,
                useCustomImage: false,
                customImageUrl: "",
              }))
            );
          }}
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

      <div>
        <label>Cover Photo</label>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginTop: "10px",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label>
              <input
                type="radio"
                checked={!useCustomCover}
                onChange={() => setUseCustomCover(false)}
              />
              Default Image
            </label>

            <br />

            <label>
              <input
                type="radio"
                checked={useCustomCover}
                onChange={() => setUseCustomCover(true)}
              />
              Upload Custom Image
            </label>
          </div>
          {!useCustomCover && (
            <>
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

          <hr />

          <p>Selected Image</p>

          {selectedCoverImage && (
            <img
              src={getImageUrl(selectedCoverImage.filePath)}
              width={250}
              alt="Selected Cover"
            />
          )}
          </>)}
          
          {useCustomCover && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
              />

              <br />
              <br />

              {customCoverImageUrl && (
                <img
                  src={getImageUrl(customCoverImageUrl)}
                  width={250}
                  alt="Custom Cover"
                />
              )}
            </>
          )}
        </div>
      </div>

      <br />

      <h2>Sections</h2>

        {sections.map((section, index) => {
          const selectedSectionImage = images.find(
            image => image.id === section.sectionImageId
          );
        return(
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

            <br />

            <div>
              <label>Section Image</label>
              <br />

            <div style={{ marginBottom: "1rem" }}>
                  <label>
                    <input
                      type="radio"
                      checked={!section.useCustomImage}
                      onChange={() =>
                        toggleSectionImageType(index, false)
                      }
                    />
                    Default Image
                  </label>

                  <br />

                  <label>
                    <input
                      type="radio"
                      checked={!!section.useCustomImage}
                      onChange={() =>
                        toggleSectionImageType(index, true)
                      }
                    />
                    Upload Custom Image
                  </label>
                </div>
                {!section.useCustomImage && (
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
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>

              <p>Selected Image</p>

                {selectedSectionImage && (
                    <img
                      src={getImageUrl(selectedSectionImage.filePath)}
                      width={200}
                      alt="Selected Section"
                    />
                  )}
              </>)}
              {section.useCustomImage && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSectionUpload(index, e)
                    }
                  />

                  <br />
                  <br />

                  {section.customImageUrl && (
                    <img
                      src={getImageUrl(section.customImageUrl)}
                      width={200}
                      alt="Custom Section"
                    />
                  )}
                </>
              )}
            </div>
        </div>
        );
    })}

        <button onClick={handleAddSection}>
          Add Section
        </button>

        <br />
        <br />

        {showPreview && (
          <div
            style={{
              border: "2px solid black",
              padding: "1rem",
              marginBottom: "2rem",
              backgroundColor: "#f5f5f5",
            }}
          >
            <h2>Preview</h2>

            <p>
              <strong>Category:</strong>{" "}
              {categoryId === 1
                ? "Experience"
                : categoryId === 2
                ? "Learning"
                : "Lifestyle"}
            </p>

            <p>
              <strong>Cover Image:</strong>{" "}
              {coverImageId}
            </p>

            <h1>{title}</h1>

            <p>{description}</p>

            <hr />

            {sections.map((section, index) => (
              <div
                key={index}
                style={{ marginBottom: "1rem" }}
              >
                <h3>{section.title}</h3>

                <p>{section.description}</p>

                <p>
                  Section Image:
                  {" "}
                  {section.sectionImageId}
                </p>
              </div>
            ))}

            <button
              onClick={() =>
                setShowPreview(false)
              }
            >
              Close Preview
            </button>
          </div>
        )}

      <button
        onClick={() => setShowPreview(true)}
      >
        Preview
      </button>

      <br />
      <br />

      <button onClick={handleSaveDraft}>
        Save Draft
      </button>

      <button style={{ marginLeft: "10px" }} onClick={handlePublish}>
        Publish
      </button>
    </div>
  );
}