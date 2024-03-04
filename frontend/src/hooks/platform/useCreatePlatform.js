import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreatePlatform(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/platform', data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const createPlatform = (data) => {
    const {
      brand_id,
      name,
      platform_id,
      platform_secret,
      status,
      type,
    } = data
    mutate({
      brand_id,
      name,
      platform_id,
      platform_secret,
      status,
      type,
    })
  }

  return { ...result, createPlatform }
}
