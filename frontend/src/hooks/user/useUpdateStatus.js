import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateStatus(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put('/user/status', data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateStatus = (status) => {
    mutate({ status })
  }

  return { ...result, updateStatus }
}
