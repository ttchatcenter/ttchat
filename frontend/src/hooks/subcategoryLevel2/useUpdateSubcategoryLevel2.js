import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useUpdateSubcategoryLevel2(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/subcategory-level2/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateSubcategoryLevel2 = (id, data) => {
    mutate({ id, data })
  }

  return { ...result, updateSubcategoryLevel2 }
}
