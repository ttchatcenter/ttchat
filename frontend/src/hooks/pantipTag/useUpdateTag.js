import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateTag(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/pantip-tag/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateTag = (id, data) => {
    const {
      brand_id,
      keyword,
      status,
    } = data
    mutate({
      id,
      data: {
        brand_id,
        keyword,
        status,
      },
    })
  }

  return { ...result, updateTag }
}
