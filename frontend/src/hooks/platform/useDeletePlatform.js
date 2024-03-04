import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useDeletePlatform(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(`/platform/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })

  const deletePlatform = (id) => {
    mutate({ id })
  }

  return { ...result, deletePlatform }
}
