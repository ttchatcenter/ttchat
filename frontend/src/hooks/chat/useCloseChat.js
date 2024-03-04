import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCloseChat(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, category, subcategory, subcategoryLevel2 }) => {
      const response = await axios.post(`/chat/${id}/close`, { category, subcategory, subcategoryLevel2 })
      return response.data
    },
    onSuccess,
    onError,
  })

  const close = (id, category, subcategory, subcategoryLevel2) => {
    mutate({ id, category, subcategory, subcategoryLevel2 })
  }

  return { ...result, close }
}
