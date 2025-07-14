import { getApi, postApi, patchApi, deleteApi } from "@/lib/api/api";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  DeleteCommentResponse,
  CommentResponse,
  CommentListResponse,
} from "./comment.interface";

// 1. Tạo comment mới
export async function createCommentApi(
  body: CreateCommentRequest
): Promise<CommentResponse> {
  return postApi<Comment>("/comment", body);
}

// 2. Sửa comment
export async function updateCommentApi(
  id: string,
  body: UpdateCommentRequest
): Promise<CommentResponse> {
  return patchApi<Comment>(`/comment/${id}`, body);
}

// 3. Xoá comment
export async function deleteCommentApi(
  id: string
): Promise<DeleteCommentResponse> {
  return deleteApi<{ message: string }>(`/comment/${id}`);
}

// 4. Lấy chi tiết 1 comment
export async function getCommentDetailApi(
  id: string
): Promise<CommentResponse> {
  return getApi<Comment>(`/comment/${id}`);
}

// 5. Lấy danh sách comment cha theo postId (có phân trang)
export async function getCommentsByPostApi(
  postId: string,
  params?: { page?: number; pageSize?: number }
): Promise<CommentListResponse> {
  return getApi<Comment[]>(`/comment/by-post/${postId}`, { params });
}

// 6. Lấy danh sách reply (comment con) theo parentId (có phân trang)
export async function getRepliesByParentIdApi(
  parentId: string,
  params?: { page?: number; pageSize?: number }
): Promise<CommentListResponse> {
  return getApi<Comment[]>(`/comment/replies/${parentId}`, { params });
}
