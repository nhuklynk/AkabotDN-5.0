import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost, type UpdatePostPayload } from '@/services/admin/posts/updatePost';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdatePostPayload }) => 
      updatePost(id, payload),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
