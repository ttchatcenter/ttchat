import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreateTags(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, name }) => {
      const response = await axios.post(`/chat/${id}/tags`, { name })
      return response.data
    },
    onSuccess,
    onError,
  })

  const createTags = (id, name) => {
    mutate({ id, name })
  }

  return { ...result, createTags }
}
