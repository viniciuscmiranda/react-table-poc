export type Post = {
  id: Identifier;
  title: string;
  body: string;
  userId: Identifier;
};

// helpers
export type CreatePostData = CreateModelData<Post>;
export type UpdatePostData = UpdateModelData<CreatePostData>;
export type PostId = Post['id'];

// queries
export type PostsParams = QueryParams<Post>;

// methods
export type GetPost = GetModel<Post, PostId>;
export type CreatePost = CreateModel<Post, CreatePostData>;
export type UpdatePost = UpdateModel<Post, UpdatePostData, PostId>;
export type DeletePost = DeleteModel<PostId>;

export type PostMethods = {
  getPost: GetPost;
  createPost: CreatePost;
  updatePost: UpdatePost;
  deletePost: DeletePost;
};
