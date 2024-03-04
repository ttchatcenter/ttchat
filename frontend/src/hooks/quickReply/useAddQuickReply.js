import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useAddQuickReply(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ data }) => {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const response = await axios.post(`/chat-quick-reply`, data, options)
      return response.data
    },
    onSuccess,
    onError,
  })

  const addQuickReply = (data) => {
    mutate({ data})
  }

  return { ...result, addQuickReply }
}
