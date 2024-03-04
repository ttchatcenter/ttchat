import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateUser(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/user/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateUser = (id, data) => {
    const {
      employee_id,
      username,
      firstname,
      lastname,
      email,
      password,
      tel,
      role,
      status
    } = data
    mutate({
      id,
      data: {
        employee_id,
        username,
        firstname,
        lastname,
        email,
        password,
        tel,
        role,
        status
      }
    })
  }

  return { ...result, updateUser }
}
