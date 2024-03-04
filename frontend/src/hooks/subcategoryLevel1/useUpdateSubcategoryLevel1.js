import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useUpdateSubcategoryLevel1(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`/subcategory-level1/${id}`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const updateSubcategoryLevel1 = (id, data) => {
    mutate({ id, data })
  }

  return { ...result, updateSubcategoryLevel1 }
}
