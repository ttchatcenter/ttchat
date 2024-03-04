import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateBrandLogo(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const response = await axios.post(`/brand/${id}/logo`, data, options)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateBrandLogo = (id, data) => {
    const {
      logo
    } = data
    mutate({
      id,
      data: {
        _method: 'PUT',
        logo,
      }
    })
  }

  return { ...result, updateBrandLogo }
}
