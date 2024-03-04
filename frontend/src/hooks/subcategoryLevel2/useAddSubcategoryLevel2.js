import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useAddSubcategoryLevel2(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ data }) => {
      const response = await axios.post(`/subcategory-level2`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const addSubcategoryLevel2 = (data) => {
    mutate({ data })
  }

  return { ...result, addSubcategoryLevel2 }
}
