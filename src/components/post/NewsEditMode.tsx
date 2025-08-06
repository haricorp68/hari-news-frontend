"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit3, Check, Loader2 } from "lucide-react";
import { NewsSummaryCard } from "@/components/post/NewsSummaryCard";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useDeleteUserNewsPost } from "@/lib/modules/post/hooks/useDeleteUserNewsPost";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { UserNewsPostSummary } from "@/lib/modules/post/post.interface";
import { useMediaQuery } from "react-responsive";
import { EditNewsPostDialog } from "@/components/post/EditNewsPostDialog";
import { UserNewsPost } from "@/lib/modules/post/post.interface";

interface NewsEditModeProps {
  posts: UserNewsPostSummary[];
  loading: boolean;
  isOwnProfile: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function NewsEditMode({
  posts,
  loading,
  isOwnProfile,
  onRefresh,
  className = "",
}: NewsEditModeProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const deletePostMutation = useDeleteUserNewsPost();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    setSelectedPosts(new Set()); // Clear selection when toggling
  }, []);

  // Handle single post selection
  const togglePostSelection = useCallback((postId: string) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  // Select all posts
  const selectAllPosts = useCallback(() => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map((post) => post.id)));
    }
  }, [posts, selectedPosts.size]);

  // Handle delete multiple posts
  const handleDeletePosts = useCallback(async () => {
    if (selectedPosts.size === 0) return;

    try {
      // Delete posts one by one
      const deletePromises = Array.from(selectedPosts).map((postId) =>
        deletePostMutation.mutateAsync(postId)
      );

      await Promise.all(deletePromises);

      toast.success(`Đã xóa ${selectedPosts.size} bài viết thành công`);
      setSelectedPosts(new Set());
      setEditMode(false);
      setShowDeleteDialog(false);

      // Refresh data if callback provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting posts:", error);
      toast.error("Có lỗi xảy ra khi xóa bài viết");
    }
  }, [selectedPosts, deletePostMutation, onRefresh]);

  // Handle delete single post
  const handleDeleteSinglePost = useCallback(async () => {
    if (!postToDelete) return;

    try {
      await deletePostMutation.mutateAsync(postToDelete);
      setPostToDelete(null);
      setShowSingleDeleteDialog(false);

      // Refresh data if callback provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Có lỗi xảy ra khi xóa bài viết");
    }
  }, [postToDelete, deletePostMutation, onRefresh]);

  // Handle open single delete dialog
  const handleOpenSingleDeleteDialog = useCallback((postId: string) => {
    setPostToDelete(postId);
    setShowSingleDeleteDialog(true);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`flex flex-col gap-6 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No posts message
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Không có bài viết nào.
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Edit Mode Controls for both desktop and mobile */}
      {isOwnProfile && (
        <div className="flex items-center justify-between mb-4 p-2 md:p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 md:gap-4">
            {!editMode ? (
              // Button to enter edit mode
              <Button
                variant="outline"
                onClick={toggleEditMode}
                className="gap-1 md:gap-2 text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            ) : (
              // Buttons when in edit mode
              <>
                <Button
                  variant="outline"
                  onClick={toggleEditMode}
                  className="gap-1 md:gap-2 text-sm"
                >
                  <Check className="w-4 h-4" />
                  Hoàn tất
                </Button>

                {posts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedPosts.size === posts.length}
                      onCheckedChange={selectAllPosts}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Chọn tất cả ({selectedPosts.size}/{posts.length})
                    </label>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Delete Action */}
          {editMode && selectedPosts.size > 0 && (
            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="gap-1 md:gap-2 text-sm"
                  disabled={deletePostMutation.isPending}
                >
                  {deletePostMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Xóa ({selectedPosts.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa {selectedPosts.size} bài viết đã
                    chọn? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeletePosts}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deletePostMutation.isPending}
                  >
                    {deletePostMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Đang xóa...
                      </>
                    ) : (
                      "Xóa"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}

      {/* Posts List */}
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="relative group">
            {/* Action Buttons (Edit/Delete) */}
            {isOwnProfile && (
              <div
                className={`absolute top-4 right-4 z-10 flex gap-2 transition-opacity duration-200 
                  ${
                    editMode || isMobile
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
              >
                {editMode ? (
                  <div className="flex items-center bg-white rounded-full p-1 shadow-sm">
                    <Checkbox
                      checked={selectedPosts.has(post.id)}
                      onCheckedChange={() => togglePostSelection(post.id)}
                      className="w-5 h-5"
                    />
                  </div>
                ) : (
                  <>
                    <EditNewsPostDialog
                      // This assumes `post` is a full UserNewsPost.
                      // You may need to fetch the full post data here if `posts` only contains summaries.
                      post={post as UserNewsPost}
                      trigger={
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenSingleDeleteDialog(post.id);
                      }}
                      className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600 shadow-sm"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Post Card with conditional styling */}
            <div className={editMode && isOwnProfile ? "pl-8" : ""}>
              <NewsSummaryCard post={post} />
            </div>
          </div>
        ))}
      </div>

      {/* Single Post Delete Dialog */}
      <AlertDialog
        open={showSingleDeleteDialog}
        onOpenChange={setShowSingleDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSinglePost}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
