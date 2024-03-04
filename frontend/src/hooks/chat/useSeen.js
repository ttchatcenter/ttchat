import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useSeen(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id }) => {
      const response = await axios.post(`/chat/${id}/seen`)
      return response.data
    },
    onSuccess,
    onError,
  })

  const seen = (id) => {
    mutate({ id })
  }

  return { ...result, seen }
}
