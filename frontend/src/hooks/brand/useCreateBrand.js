import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreateBrand(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const response = await axios.post('/brand', data, options)
      return response.data
    },
    onSuccess,
    onError,
  })

  const createBrand = (data) => {
    const {
      logo,
      name,
      description,
    } = data
    mutate({
      logo,
      name,
      description,
    })
  }

  return { ...result, createBrand }
}
