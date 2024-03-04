import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useAssign(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, member_id }) => {
      const response = await axios.post(`/chat/${id}/assign`, { member_id })
      return response.data
    },
    onSuccess,
    onError,
  })

  const assign = (id, member_id) => {
    mutate({ id, member_id })
  }

  return { ...result, assign }
}
