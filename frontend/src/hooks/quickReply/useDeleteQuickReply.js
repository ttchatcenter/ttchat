import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useDeleteQuickReply(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(`/chat-quick-reply/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })

  const deleteQuickReply = (id) => {
    mutate({ id })
  }

  return { ...result, deleteQuickReply }
}
