import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useTotalQueueWaiting(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["totalQueueWaiting", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/report/total-queue-waiting", {
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
