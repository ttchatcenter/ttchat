import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useRejectChat(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await axios.post(`/chat/${id}/reject`, { reason })
      return response.data
    },
    onSuccess,
    onError,
  })

  const reject = (id, reason) => {
    mutate({ id, reason })
  }

  return { ...result, reject }
}
