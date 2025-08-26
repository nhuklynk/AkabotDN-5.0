import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { deletePost } from '@/services/admin/posts/deletePost';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string | number) => deletePost(id),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
  });

  const mutate = useCallback((id: string | number) => mutation.mutateAsync(id), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
};
