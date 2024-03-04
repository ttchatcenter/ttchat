import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useDeleteSubcategoryLevel2(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(`/subcategory-level2/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })

  const deleteSubcategoryLevel2 = (id) => {
    mutate({ id })
  }

  return { ...result, deleteSubcategoryLevel2 }
}
