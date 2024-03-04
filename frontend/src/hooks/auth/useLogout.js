import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useLogout(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete('/auth/logout')
      return response.data
    },
    onSuccess,
    onError,
  })

  const logout = () => {
    mutate()
  }

  return { ...result, logout }
}
