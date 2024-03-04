import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useFacebookReplied(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, text, comment_id, bypass }) => {
      const body = { comment_id, text }
      if (bypass) {
        body.bypass = true
      }
      const response = await axios.post(`/facebook-post/${id}`, body)
      return response.data
    },
    onSuccess,
    onError,
  })

  const reply = (id, comment_id, text, bypass = false) => {
    mutate({ id, comment_id, text, bypass })
  }

  return { ...result, reply }
}
