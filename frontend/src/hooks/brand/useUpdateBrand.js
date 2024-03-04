import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateBrand(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/brand/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateBrand = (id, data) => {
    const {
      name,
      description,
    } = data
    mutate({
      id,
      data: {
        name,
        description,
      }
    })
  }

  return { ...result, updateBrand }
}
