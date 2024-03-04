import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useResetPassword(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (credential) => {
      const response = await axios.post('/auth/reset-password', credential)
      return response.data
    },
    onSuccess,
    onError,
  })

  const resetPassword = (data) => {
    const { password} = data
    mutate({ password})
  }

  return { ...result, resetPassword }
}
