import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListCategory(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["getCategoryList", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/category", { params })
        return response.data
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.brand_id,
  })

  return { list: data || [], ...rest }
}
