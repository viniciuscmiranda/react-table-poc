import { api } from 'api';
import { CreatePostData, Post, PostId, PostsParams, UpdatePostData } from 'types/Posts';

export function getPosts(params?: PostsParams) {
  return api.get<Post[]>('/posts', { params });
}

export function getPost(postId: PostId) {
  return api.get<Post>(`/posts/${postId}`);
}

export function createPost(data: CreatePostData) {
  return api.post<Post>('/posts', data);
}

export function updatePost(data: UpdatePostData, postId: PostId) {
  return api.patch<Post>(`/posts/${postId}`, data);
}

export function deletePost(postId: PostId) {
  return api.delete<void>(`/posts/${postId}`);
}
