import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListDashboardOverallPerformance(
  params,
  skip = false
) {
  const { data, ...rest } = useQuery({
    queryKey: ["listDashboardOverallPerformance", params],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "/report/dashboard-overall-performance",
          {
            params,
          }
        )
        return response.data
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.brand_id && !skip,
  })

  return {
    data: data || [],
    ...rest,
  }
}
