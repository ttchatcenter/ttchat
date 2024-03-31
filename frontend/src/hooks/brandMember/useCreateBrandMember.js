import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreateBrandMember(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/brand-member', data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const createBrandMember = (data) => {
    const {
      brand_id,
      user_id,
      display_name,
      status,
      platform_1,
      platform_2,
      platform_3,
      platform_4,
      platform_5,
      concurrent_1,
      concurrent_2,
      concurrent_3,
      concurrent_4,
      concurrent_5,
    } = data
    mutate({
      brand_id,
      user_id,
      display_name,
      status,
      platform_1,
      platform_2,
      platform_3,
      platform_4,
      platform_5,
      concurrent_1,
      concurrent_2,
      concurrent_3,
      concurrent_4,
      concurrent_5,
    })
  }

  return { ...result, createBrandMember }
}
