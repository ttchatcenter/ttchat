import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreateTag(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/pantip-tag', data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const createTag = (data) => {
    const {
      brand_id,
      keyword,
      status,
    } = data
    mutate({
      brand_id,
      keyword,
      status,
    })
  }

  return { ...result, createTag }
}
