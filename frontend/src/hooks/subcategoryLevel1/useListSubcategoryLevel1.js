import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListSubcategoryLevel1(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["getSubcategoryLevel1List", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/subcategory-level1", { params })
        return response.data
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.brand_id && !!params?.category_id,
  })

  return { list: data || [], ...rest }
}
