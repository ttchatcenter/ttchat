import axios from "@/libs/axios"
import { useQuery } from "@tanstack/react-query"

export default function useListMemberWithTimeInStatus(params) {
  const { data, ...rest } = useQuery({
    queryKey: ["getMemberWithTimeInStatusList", params],
    queryFn: async () => {
      try {
        const response = await axios.get("/report/member-with-time-in-status", {
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

  return { members: data?.members || [], ...rest }
}
