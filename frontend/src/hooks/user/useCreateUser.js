import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreateUser(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/auth/register', data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const createUser = (data) => {
    const {
      employee_id,
      username,
      firstname,
      lastname,
      email,
      password,
      role,
      status
    } = data
    mutate({
      employee_id,
      username,
      firstname,
      lastname,
      email,
      password,
      role,
      status
    })
  }

  return { ...result, createUser }
}
