import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListOverallPerformance(params, skip = false) {
  const { data, ...rest } = useQuery({
    queryKey: ["listOverallPerformance", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/report/overall-performance", {
          params,
        })
        return response.data
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.brand_id && !skip,
  })

  return {
    list: !Array.isArray(data?.data) ? data?.data || {} : {},
    timeStart: data?.timeStart,
    timeEnd: data?.timeEnd,

    ...rest,
  }
}
