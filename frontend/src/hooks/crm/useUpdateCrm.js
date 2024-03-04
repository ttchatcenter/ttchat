import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateCrm(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ data }) => {
      const response = await axios.post(`/brand/crm`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateCrm = (brand_id, data) => {
    const {
      link,
      status,
    } = data
    mutate({
      data: {
        brand_id,
        link,
        status,
      }
    })
  }

  return { ...result, updateCrm }
}
