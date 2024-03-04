import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateBrandMember(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/brand-member/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateBrandMember = (id, data) => {
    const {
      display_name,
      status,
      platform_1,
      platform_2,
      platform_3,
      platform_4,
      concurrent_1,
      concurrent_2,
      concurrent_3,
      concurrent_4,
    } = data
    mutate({
      id,
      data: {
        display_name,
        status,
        platform_1,
        platform_2,
        platform_3,
        platform_4,
        concurrent_1,
        concurrent_2,
        concurrent_3,
        concurrent_4,
      }
    })
  }

  return { ...result, updateBrandMember }
}
