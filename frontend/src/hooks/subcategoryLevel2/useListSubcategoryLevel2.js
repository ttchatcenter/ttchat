import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListSubcategoryLevel2(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["getSubcategoryLevel2List", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/subcategory-level2", { params })
        return response.data
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled:
      !!params?.brand_id &&
      !!params?.category_id &&
      !!params?.subcategory_level1_id,
  })

  return { list: data || [], ...rest }
}
