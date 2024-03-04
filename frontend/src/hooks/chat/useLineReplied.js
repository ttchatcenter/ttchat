import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useLineReplied(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, text, is_image }) => {
      const body = { text, is_image }
      const response = await axios.post(`/line-chat/${id}`, body)
      return response.data
    },
    onSuccess,
    onError,
  })

  const reply = (id, text, is_image = false) => {
    mutate({ id, text, is_image })
  }

  return { ...result, reply }
}
