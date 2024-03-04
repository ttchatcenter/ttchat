import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useMessengerReplied(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, text, bypass }) => {
      const body = { text }
      if (bypass) {
        body.bypass = true
      }
      const response = await axios.post(`/messenger-chat/${id}`, body)
      return response.data
    },
    onSuccess,
    onError,
  })

  const reply = (id, text, bypass = false) => {
    mutate({ id, text, bypass })
  }

  return { ...result, reply }
}
