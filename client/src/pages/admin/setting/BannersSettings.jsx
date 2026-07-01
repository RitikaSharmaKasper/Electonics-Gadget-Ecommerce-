import React, { useState, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { X, Plus, Trash2, Edit2, Check, XCircle } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const BannersSettings = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [fileError, setFileError] = useState("");
  const [removedImages, setRemovedImages] = useState([]);

  // Premium Features State
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFeature, setNewFeature] = useState({ text: "" });
  const [originalBanner, setOriginalBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const banners = [
    { id: 1, name: "Banner 1" },
    // { id: 2, name: "Banner 2" },
  ];

  const handleSaveBanner = async () => {
    const maxLimit = selectedBanner.type === "hero" ? 6 : 8;

    const existingImages = selectedBanner.images
      .filter((img) => !(img instanceof File))
      .map((img) => img.url);

    const newImages = selectedBanner.images.filter(
      (img) => img instanceof File,
    );

    const finalCount = existingImages.length + newImages.length;

    if (finalCount > maxLimit) {
      toast.error(`Max ${maxLimit} images allowed`);
      return;
    }

    const formData = new FormData();
    formData.append("sectionType", selectedBanner.type);
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("removedImages", JSON.stringify(removedImages));

    newImages.forEach((img) => {
      formData.append("banner", img);
    });

    const savePromise = axiosInstance.post(
      "/dashboard/banner/upload-banner",
      formData,
    );

    toast.promise(savePromise, {
      pending: "Saving banner...",
      success: "Banner updated successfully 🎉",
      error: "Upload failed ❌",
    });

    try {
      await savePromise;

      await fetchBanners(); // refresh data
      setRemovedImages([]);

      // optional: close modal after save
      setIsModalOpen(false);
      setSelectedBanner(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch features on mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/settings/homepage-features");
      if (response.data.success) {
        setFeatures(response.data.data);
      } else {
        setFeatures([]);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.text.trim()) {
      toast.error("Please enter feature text");
      return;
    }

    const addPromise = axiosInstance.post(
      "/settings/homepage-features",
      newFeature,
    );

    toast.promise(addPromise, {
      pending: "Adding feature...",
      success: "Feature added successfully ",
      error: "Failed to add feature ",
    });

    try {
      const response = await addPromise;

      if (response.data.success) {
        setNewFeature({ text: "" });
        setIsAddingNew(false);
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error adding feature:", error);
    }
  };

  const handleUpdateFeature = async (feature) => {
    try {
      const updatedFeatures = features.map((f) =>
        f._id === feature._id ? feature : f,
      );

      const response = await axiosInstance.put("/settings/homepage-features", {
        features: updatedFeatures,
      });
      if (response.data.success) {
        toast.success("Feature updated successfully");
        setEditingFeature(null);
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error updating feature:", error);
      toast.error("Failed to update feature");
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      const response = await axiosInstance.delete(
        `/settings/homepage-features/${featureId}`,
      );
      if (response.data.success) {
        toast.success("Feature deleted successfully");
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast.error("Failed to delete feature");
    }
  };

  // const handleVideoUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const maxSize = 8 * 1024 * 1024;

  //   if (file.size > maxSize) {
  //     setFileError("Video must be less than 8MB");
  //     e.target.value = "";
  //     return;
  //   }

  //   setFileError("");
  //   const videoURL = URL.createObjectURL(file);
  //   setVideoPreview(videoURL);
  // };

  // const handleRemoveVideo = () => {
  //   setVideoPreview(null);
  // };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/banner/get-all-banners");

      const hero = res.data.data.find((b) => b.sectionType === "hero");
      const carousel = res.data.data.find((b) => b.sectionType === "carousel");

      const bannerData = {
        heroId: hero?._id,
        carouselId: carousel?._id,
        type: "hero",
        heroImages: hero ? hero.items : [],
        carouselImages: carousel ? carousel.items : [],
        images: hero?.items || [],
      };

      setOriginalBanner(JSON.parse(JSON.stringify(bannerData)));
      setSelectedBanner(null); // do NOT open modal here

      setOriginalBanner(JSON.parse(JSON.stringify(bannerData)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-semibold text-[20px] mb-2">Banners</h1>
          <span className="text-[#686868] text-[14px]">
            Manage banners displayed on the customer homepage.
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Serial No.
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Banner Number
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.id} className="border-b border-[#E5E7EB]">
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {index + 1}.
                </td>
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {banner.name}
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => {
                      setSelectedBanner(
                        JSON.parse(JSON.stringify(originalBanner)),
                      ); // editable copy
                      setIsModalOpen(true);
                    }}
                    className="text-[#2563EB] text-[14px] font-medium hover:underline"
                  >
                    +Add Banner
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* for premium text form start */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-semibold text-[20px] mb-2">Feature Bar</h1>
            <span className="text-[#686868] text-[14px]">
              Manage the text displayed in the feature bar. Maximum 3 texts are
              allowed.
            </span>
          </div>
          {features.length < 3 && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-[#1C3753] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a6e] flex items-center gap-2"
            >
              <Plus size={18} />
              Add Feature
            </button>
          )}
        </div>

        {/* Add New Feature Modal */}
        {isAddingNew && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-[460px] bg-white rounded-[8px] shadow-lg p-6">
              <h2 className="text-[18px] font-semibold text-[#111827] mb-4">
                Add New Feature
              </h2>

              <div className="mb-5">
                <label className="block text-[14px] text-[#374151] mb-2">
                  Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFeature.text}
                  onChange={(e) => setNewFeature({ text: e.target.value })}
                  placeholder="Enter feature text"
                  className="w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddFeature}
                  className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewFeature({ text: "" });
                  }}
                  className="border border-[#94A3B8] text-[#183B63] text-[14px] font-medium px-5 py-2 rounded-[6px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Table - Removed Status and Order columns */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C3753]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Serial No.
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Text
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-medium text-[#111827] border-b border-[#E5E7EB]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature._id} className="border-b border-[#E5E7EB]">
                    <td className="px-6 py-5 text-[14px] text-[#111827]">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-5 text-[14px] text-[#111827]">
                      {editingFeature?._id === feature._id ? (
                        <input
                          type="text"
                          value={editingFeature.text}
                          onChange={(e) =>
                            setEditingFeature({
                              ...editingFeature,
                              text: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        feature.text
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {editingFeature?._id === feature._id ? (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateFeature(editingFeature)
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingFeature(null)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingFeature(feature)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteFeature(feature._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {features.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg border">
            No features added yet. Click "Add Feature" to create one.
          </div>
        )}
      </div>
      {/* for premium text form end */}

      {/* Banner Modal */}
      {isModalOpen && selectedBanner && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-[460px] bg-white rounded-[8px] shadow-lg p-4">
            {/* Heading */}
            <h2 className="text-[16px] font-semibold text-[#111827] mb-3">
              Banner Settings
            </h2>

            {/* ✅ Radio Buttons */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bannerType"
                  value="hero"
                  checked={selectedBanner.type === "hero"}
                  onChange={() =>
                    setSelectedBanner((prev) => ({
                      ...prev,
                      type: "hero",
                      images: prev.heroImages || [],
                    }))
                  }
                />
                <span className="text-sm">Hero</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bannerType"
                  value="carousel"
                  checked={selectedBanner.type === "carousel"}
                  onChange={() =>
                    setSelectedBanner((prev) => ({
                      ...prev,
                      type: "carousel",
                      images: prev.carouselImages || [],
                    }))
                  }
                />
                <span className="text-sm">Carousel</span>
              </label>
            </div>

            {/* ✅ Image Upload */}
            <div className="flex flex-wrap gap-3">
              {selectedBanner.images?.map((img, i) => (
                <div key={i} className="relative w-[80px] h-[80px]">
                  <img
                    src={
                      img instanceof File ? URL.createObjectURL(img) : img.url
                    }
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => {
                      const removedImg = selectedBanner.images[i];

                      // If it's a new file → just remove from UI
                      if (removedImg instanceof File) {
                        setSelectedBanner((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, index) => index !== i),
                        }));
                        return;
                      }

                      const bannerId =
                        selectedBanner.type === "hero"
                          ? selectedBanner.heroId
                          : selectedBanner.carouselId;

                      const deletePromise = axiosInstance.delete(
                        `/dashboard/banner/delete-banner/${bannerId}`,
                        {
                          data: { publicId: removedImg.publicId },
                        },
                      );

                      toast.promise(deletePromise, {
                        pending: "Deleting image...",
                        success: "Deleted successfully 👌",
                        error: "Delete failed ❌",
                      });

                      deletePromise
                        .then(() => {
                          // ✅ Update UI only after success
                          setSelectedBanner((prev) => ({
                            ...prev,
                            images: prev.images.filter(
                              (_, index) => index !== i,
                            ),
                          }));
                        })
                        .catch((err) => {
                          console.error(err);
                        });
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {(selectedBanner.images?.length || 0) <
                (selectedBanner.type === "hero" ? 6 : 8) && (
                <label className="w-[80px] h-[80px] border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      setSelectedBanner((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), file],
                      }));
                    }}
                  />
                  <span className="text-xl text-gray-500">+</span>
                </label>
              )}
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 mt-2">
              {selectedBanner.type === "hero" ? (
                <>
                  Max. Size is 500 KB <br /> Min. 3 & Max. 6 images are allowed{" "}
                  <br /> Only *.png, *.jpg and *.jpeg image files are accepted
                </>
              ) : (
                <>
                  Max. Size is 500 KB <br /> Min. 3 & Max. 8 images are allowed{" "}
                  <br /> Only *.png, *.jpg and *.jpeg image files are accepted
                </>
              )}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleSaveBanner}
                className="bg-[#183B63] hover:bg-[#163556] text-white text-[14px] font-medium px-5 py-2 rounded-[6px]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setSelectedBanner(null); // clear editing state
                  setRemovedImages([]);
                  setIsModalOpen(false); // close modal
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannersSettings;
