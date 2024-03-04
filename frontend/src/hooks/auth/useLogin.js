import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useLogin(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (credential) => {
      const response = await axios.post('/auth/login', credential)
      return response.data
    },
    onSuccess,
    onError,
  })

  const login = (data) => {
    const { username, password } = data
    mutate({ username, password })
  }

  return { ...result, login }
}
