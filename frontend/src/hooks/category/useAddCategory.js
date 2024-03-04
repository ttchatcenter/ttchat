import { useMutation } from "@tanstack/react-query"
import axios from "@/libs/axios"

export default function useAddCategory(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ data }) => {
      const response = await axios.post(`/category`, data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const addCategory = (data) => {
    mutate({ data })
  }

  return { ...result, addCategory }
}
