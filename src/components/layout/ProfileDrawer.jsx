import React, { useState, useEffect } from "react";
import { X, Upload, User, Camera, Save, Edit2, Loader2 } from "lucide-react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const ProfileDrawer = ({ isOpen, onClose, user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingIdCards, setUploadingIdCards] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    department: "",
    field: "",
    extensionId: "",
    role: "",
    profileImage: "",
    idCards: [],
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinAddress: "",
  });

  const db = getFirestore();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
        department: user.department || "",
        field: user.field || "",
        extensionId: user.extensionId || "",
        role: user.role || "",
        profileImage: user.profileImage || "",
        idCards: user.idCards || [],
        nextOfKinName: user.nextOfKinName || "",
        nextOfKinPhone: user.nextOfKinPhone || "",
        nextOfKinAddress: user.nextOfKinAddress || "",
      });

      const isIncomplete =
        !user.firstName ||
        !user.lastName ||
        !user.phone ||
        !user.department ||
        !user.address;
      if (isIncomplete && isOpen) {
        setIsEditing(true);
      }
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadToCloudinary = async (file, userName, category) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("name", userName);
    formDataUpload.append("category", category);

    try {
      const response = await fetch(
        "https://osondu-server.onrender.com/api/upload",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.authId) return;

    try {
      setUploadingProfile(true);
      const userName = `${user.firstName || "User"}_${
        user.lastName || user.authId
      }`;
      const imageUrl = await uploadToCloudinary(
        file,
        userName,
        "profile_images"
      );

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      } else {
        alert("Failed to upload profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image");
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleIdCardsUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !user?.authId) return;

    try {
      setUploadingIdCards(true);
      const userName = `${user.firstName || "User"}_${
        user.lastName || user.authId
      }`;
      const uploadedImageUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await uploadToCloudinary(file, userName, "id_cards");
        if (imageUrl) {
          uploadedImageUrls.push({
            url: imageUrl,
            name: file.name,
            uploadedAt: new Date().toISOString(),
          });
        }
      }

      if (uploadedImageUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          idCards: [...(prev.idCards || []), ...uploadedImageUrls],
        }));
      } else {
        alert("Failed to upload ID cards");
      }
    } catch (error) {
      console.error("Error uploading ID cards:", error);
      alert("Failed to upload some ID cards");
    } finally {
      setUploadingIdCards(false);
    }
  };

  const removeIdCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      idCards: prev.idCards.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!user?.authId) return;

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert(
        "Please fill in all required fields (First Name, Last Name, Phone)"
      );
      return;
    }

    setLoading(true);
    try {
      const authorizedByName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.email || "Unknown User";

      const userRef = doc(db, "users", user.authId);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        department: formData.department,
        field: formData.field,
        extensionId: formData.extensionId,
        profileImage: formData.profileImage,
        idCards: formData.idCards,
        nextOfKinName: formData.nextOfKinName,
        nextOfKinPhone: formData.nextOfKinPhone,
        nextOfKinAddress: formData.nextOfKinAddress,
        authorizedBy: authorizedByName,
        updatedAt: new Date().toISOString(),
      });

      if (onUpdate) {
        await onUpdate(user.authId);
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Animated Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Animated Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header with Gradient */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-600 via-gray-800 to-white-800 p-5 text-white relative overflow-hidden"
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Profile</h2>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={loading}
                        className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 font-medium text-sm shadow-lg"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {loading ? "Saving..." : "Save"}
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-xl backdrop-blur-sm">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute -bottom-1 -right-1 bg-white text-gray-700 p-2 rounded-full cursor-pointer shadow-lg hover:bg-gray-50 transition-all">
                          {uploadingProfile ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Camera className="w-3.5 h-3.5" />
                          )}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                            disabled={uploadingProfile}
                          />
                        </label>
                      )}
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {formData.firstName} {formData.lastName || "User"}
                    </h3>
                    <p className="text-gray-100 text-sm">
                      {formData.role || "Employee"}
                    </p>
                    <p className="text-gray-200 text-xs mt-0.5">
                      {formData.email}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-6">
                {/* Basic Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-100">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+234..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Enter your full address"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all"
                    />
                  </div>
                </motion.div>

                {/* Work Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-100">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Work Information
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Field/Position
                      </label>
                      <input
                        type="text"
                        name="field"
                        value={formData.field}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Extension ID
                      </label>
                      <input
                        type="text"
                        name="extensionId"
                        value={formData.extensionId}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Next of Kin */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-100">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Next of Kin <span className="text-red-500">*</span>
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      name="nextOfKinName"
                      value={formData.nextOfKinName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Full name"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="nextOfKinPhone"
                      value={formData.nextOfKinPhone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+234..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Address
                    </label>
                    <textarea
                      name="nextOfKinAddress"
                      value={formData.nextOfKinAddress}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={2}
                      placeholder="Address"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all"
                    />
                  </div>
                </motion.div>

                {/* ID Cards */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-600 rounded-full" />
                      <h3 className="text-base font-semibold text-gray-900">
                        ID Cards <span className="text-red-500">*</span>
                      </h3>
                    </div>
                    {isEditing && (
                      <label className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-1.5 shadow-sm">
                        {uploadingIdCards ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Uploading
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                          </>
                        )}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          onChange={handleIdCardsUpload}
                          className="hidden"
                          disabled={uploadingIdCards}
                        />
                      </label>
                    )}
                  </div>

                  {formData.idCards && formData.idCards.length > 0 ? (
                    <div className="space-y-2">
                      {formData.idCards.map((card, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={card.url}
                            alt={card.name}
                            className="w-14 h-14 object-cover rounded border-2 border-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {card.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(card.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <a
                              href={card.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-2.5 py-1.5 rounded text-xs hover:bg-gray-700 transition-colors font-medium"
                            >
                              View
                            </a>
                            {isEditing && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeIdCard(index)}
                                className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-white rounded-lg border-2 border-dashed border-gray-300">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        No ID cards uploaded
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDrawer;
