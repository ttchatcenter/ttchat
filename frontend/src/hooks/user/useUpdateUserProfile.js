import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateUserProfile(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const response = await axios.post(`/user/${id}/profile`, data, options)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateUserProfile = (id, data) => {
    const {
      profile
    } = data
    mutate({
      id,
      data: {
        _method: 'PUT',
        profile,
      }
    })
  }

  return { ...result, updateUserProfile }
}
