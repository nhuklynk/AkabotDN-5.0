import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, type CreatePostPayload } from '@/services/admin/posts/createPost';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
