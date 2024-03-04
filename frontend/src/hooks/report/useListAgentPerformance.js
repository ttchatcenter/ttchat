import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListAgentPerformance(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["listAgentPerformance", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/report/agent-performance", {
          params,
        })
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
