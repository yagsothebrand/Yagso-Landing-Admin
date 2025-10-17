"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Eye,
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  Building,
  Clock,
  Loader2,
  Check,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useAuth } from "@/components/auth/AuthProvider";
import Layout from "@/components/layout/Layout";
import { useState } from "react";

export function AdministrationPage() {
  const { user, allUsers, updateUserField, deleteUpdateUserProfile, loading } =
    useAuth();
  console.log(allUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [copiedText, setCopiedText] = useState("");

  const users = allUsers || [];

  const setUserLoading = (userId, action, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [`${userId}-${action}`]: isLoading,
    }));
  };

  const isUserLoading = (userId, action) => {
    return loadingStates[`${userId}-${action}`] || false;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    let date;
    if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      return "N/A";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewUser = (u) => {
    setSelectedUser(u);
    setIsDrawerOpen(true);
  };

  const getRoleBadge = (role) => {
    const colors = {
      CEO: "bg-purple-100 text-purple-700 border-purple-200",
      "General Manager": "bg-blue-100 text-blue-700 border-blue-200",
      "Sales Representative": "bg-gray-100 text-gray-700 border-gray-200",
    };
    return <Badge className={`${colors[role]} border text-xs`}>{role}</Badge>;
  };

  const handleUpdateField = async (id, field, value, u) => {
    const loadingKey = field === "extensionId" ? "generate" : field;
    setUserLoading(id, loadingKey, true);
    try {
      await updateUserField(id, field, value, u);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUserLoading(id, loadingKey, false);
    }
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs">
        Suspended
      </Badge>
    );
  };

  const canManageUser = (targetUser) => {
    if (!user || !user.role) return false;

    const roleHierarchy = ["Sales Representative", "General Manager", "CEO"];
    const userLevel = roleHierarchy.indexOf(user.role);
    const targetUserLevel = roleHierarchy.indexOf(targetUser.role);

    if (userLevel === -1 || targetUserLevel === -1) return false;

    return user.id === targetUser.id || userLevel >= targetUserLevel;
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen  p-3 sm:p-3"
      >
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="font-semibold">
                  Dashboard
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="font-semibold">
                  Administration
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage users, roles, and system access
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-all  bg-gradient-to-br from-blue-50 to-white border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Users</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {users.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-green-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Active Users</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {users.filter((u) => u.status === "active").length}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                      <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-red-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Suspended</p>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">
                        {users.filter((u) => u.status === "inactive").length}
                      </p>
                    </div>
                    <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                      <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-purple-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Admins</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">
                        {
                          users.filter((u) =>
                            ["CEO", "General Manager"].includes(u.role)
                          ).length
                        }
                      </p>
                    </div>
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* User Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((u, index) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all border-gray-200">
                    {/* Profile Image - Large and Prominent */}
                    <div className="p-6 pb-4 bg-green-50">
                      <div className="flex flex-col items-center">
                        {u.profileImage ? (
                          <img
                            src={u.profileImage}
                            alt={`${u.firstName} ${u.lastName}`}
                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl mb-4"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-full bg-green-800 border-4 border-white shadow-xl flex items-center justify-center  text-5xl font-bold mb-4">
                            {u.firstName?.[0]}
                            {u.lastName?.[0]}
                          </div>
                        )}

                        {/* User Name and Email */}
                        <h3 className="text-xl font-bold  text-center mb-1">
                          {u.firstName} {u.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 text-center break-words w-full px-2 mb-3">
                          {u.email}
                        </p>

                        {/* Role and Status Badges */}
                        <div className="flex gap-2 justify-center">
                          {getRoleBadge(u.role)}
                          {getStatusBadge(u.status)}
                        </div>
                      </div>
                    </div>

                    <CardContent className="pt-4 pb-4 px-4 bg-white">
                      {/* User Info */}
                      <div className="space-y-3 mb-4 ">
                        {/* Extension ID */}
                        <div className=" rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1.5 font-semibold">
                            Extension ID
                          </p>
                          {u.extensionId ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-sm text-gray-900">
                                {u.extensionId}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 hover:bg-gray-200"
                                onClick={() => handleCopy(u.extensionId)}
                              >
                                {copiedText === u.extensionId ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            canManageUser(u) && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUserLoading(u.id, "generate")}
                                onClick={() =>
                                  handleUpdateField(
                                    u.id,
                                    "extensionId",
                                    Math.floor(
                                      1000 + Math.random() * 9000
                                    ).toString(),
                                    u
                                  )
                                }
                                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 text-xs h-8"
                              >
                                {isUserLoading(u.id, "generate") ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "Generate ID"
                                )}
                              </Button>
                            )
                          )}
                        </div>
                        {canManageUser(u) && (
                          <Button
                            onClick={() => deleteUpdateUserProfile(u.id)}
                            className="absolute top-2 right-2 bg-red-200  text-red-600 rounded-full p-2 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        {/* Last Login */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1.5 font-semibold">
                            Last Login
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-900">
                              {formatDate(u.lastLogin)}
                            </span>
                          </div>
                        </div>

                        {/* Role Selector */}
                        {canManageUser(u) && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-2 font-semibold">
                              Update Role
                            </p>
                            <Select
                              value={u.role}
                              onValueChange={(newRole) =>
                                handleUpdateField(u.id, "role", newRole, u)
                              }
                              disabled={isUserLoading(u.id, "role")}
                            >
                              <SelectTrigger className="w-full bg-white border-gray-300 text-xs h-8">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="Sales Representative">
                                  Sales Representative
                                </SelectItem>
                                <SelectItem value="CEO">CEO</SelectItem>
                                <SelectItem value="General Manager">
                                  General Manager
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(u)}
                          className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50 text-xs h-9"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        {canManageUser(u) && (
                          <>
                            {u.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isUserLoading(u.id, "status")}
                                onClick={() =>
                                  handleUpdateField(
                                    u.id,
                                    "status",
                                    "inactive",
                                    u
                                  )
                                }
                                className="flex-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50 text-xs h-9"
                              >
                                {isUserLoading(u.id, "status") ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "Suspend"
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isUserLoading(u.id, "status")}
                                onClick={() =>
                                  handleUpdateField(u.id, "status", "active", u)
                                }
                                className="flex-1 text-green-600 border-green-600 hover:bg-green-50 text-xs h-9"
                              >
                                {isUserLoading(u.id, "status") ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  "Activate"
                                )}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Details Side Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full bg-white sm:max-w-2xl overflow-y-auto p-0">
            {selectedUser && (
              <>
                {/* Drawer Header with Profile */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 to-white p-6">
                  <SheetHeader className="text-left">
                    <div className="flex items-start justify-between mb-4">
                      <SheetTitle className="text-2xl font-bold ">
                        User Details
                      </SheetTitle>
                    </div>
                    <div className="flex items-center gap-4">
                      {selectedUser.profileImage ? (
                        <img
                          src={selectedUser.profileImage}
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                          {selectedUser.firstName?.[0]}
                          {selectedUser.lastName?.[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold   mb-1">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h3>
                        <p className=" mb-2">{selectedUser.email}</p>
                        <div className="flex gap-2">
                          {getRoleBadge(selectedUser.role)}
                          {getStatusBadge(selectedUser.status)}
                        </div>
                      </div>
                    </div>
                  </SheetHeader>
                </div>

                {/* Drawer Content */}
                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Date of Birth
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <p className="text-gray-900">
                            {selectedUser.dateOfBirth || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Phone Number
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <p className="text-gray-900">
                            {selectedUser.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600">
                          Address
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <p className="text-gray-900">
                            {selectedUser.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building className="w-5 h-5" />
                        Work Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Department
                        </label>
                        <p className="text-gray-900 mt-1">
                          {selectedUser.department || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Field
                        </label>
                        <p className="text-gray-900 mt-1">
                          {selectedUser.field || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Extension ID
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-900 font-mono">
                            {selectedUser.extensionId || "Not Assigned"}
                          </p>
                          {selectedUser.extensionId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                handleCopy(selectedUser.extensionId)
                              }
                            >
                              {copiedText === selectedUser.extensionId ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Authorized By
                        </label>
                        <p className="text-gray-900 mt-1">
                          {selectedUser.authorizedBy || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next of Kin */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="w-5 h-5" />
                        Next of Kin Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Name
                        </label>
                        <p className="text-gray-900 mt-1">
                          {selectedUser.nextOfKinName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Phone Number
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <p className="text-gray-900">
                            {selectedUser.nextOfKinPhone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600">
                          Address
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <p className="text-gray-900">
                            {selectedUser.nextOfKinAddress || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ID Cards */}
                  {selectedUser.idCards && selectedUser.idCards.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Uploaded ID Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUser.idCards.map((doc, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 bg-gray-50"
                            >
                              <p className="text-sm font-semibold text-gray-700 mb-3">
                                {doc.name}
                              </p>
                              <img
                                src={doc.url}
                                alt={doc.name}
                                className="w-full h-56 object-cover rounded-lg mb-3 border-2 border-gray-200"
                              />
                              <p className="text-xs text-gray-500">
                                Uploaded:{" "}
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Account Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Created At
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(selectedUser.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Last Login
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(selectedUser.lastLogin)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Last Updated
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(selectedUser.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Auth ID
                        </label>
                        <p className="text-gray-900 mt-1 font-mono text-xs break-all">
                          {selectedUser.authId || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </motion.div>
    </Layout>
  );
}
