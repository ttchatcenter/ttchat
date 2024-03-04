import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useForgotPassword(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (credential) => {
      const response = await axios.post('/auth/forgot-password', credential)
      return response.data
    },
    onSuccess,
    onError,
  })

  const forgotPassword = (data) => {
    const { username, email } = data
    mutate({ username, email })
  }

  return { ...result, forgotPassword }
}
