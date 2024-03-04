import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useTimeInStatus(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["getTimeInStatus", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/report/time-in-status", {
          params,
        })
        return response.data
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.user_id,
  })

  return { data: data?.data || [], ...rest }
}
