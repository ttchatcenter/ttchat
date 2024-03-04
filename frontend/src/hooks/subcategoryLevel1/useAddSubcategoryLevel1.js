import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useAddSubcategoryLevel1(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ data }) => {
      const response = await axios.post(`/subcategory-level1`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const addSubcategoryLevel1 = (data) => {
    mutate({ data })
  }

  return { ...result, addSubcategoryLevel1 }
}
