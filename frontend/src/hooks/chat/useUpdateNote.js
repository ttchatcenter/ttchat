import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUpdateNote(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, note }) => {
      const response = await axios.post(`/chat/${id}/note`, { note })
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateNote = (id, note) => {
    mutate({ id, note })
  }

  return { ...result, updateNote }
}
