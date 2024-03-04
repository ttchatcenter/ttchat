import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdatePlatform(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/platform/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updatePlatform = (id, data) => {
    const {
      brand_id,
      name,
      platform_id,
      platform_secret,
      status,
      type,
    } = data
    mutate({
      id,
      data: {
        brand_id,
        name,
        platform_id,
        platform_secret,
        status,
        type,
      },
    })
  }

  return { ...result, updatePlatform }
}
