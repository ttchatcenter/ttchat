import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useDeleteCategory(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(`/category/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })

  const deleteCategory = (id) => {
    mutate({ id })
  }

  return { ...result, deleteCategory }
}
