import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useUpdateCategory(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/category/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateCategory = (id, data) => {
    mutate({ id, data })
  }

  return { ...result, updateCategory }
}
