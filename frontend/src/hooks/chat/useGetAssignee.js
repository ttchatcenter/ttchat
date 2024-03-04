import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetAssignee(id, source, fetch) {
  const { data, ...rest } = useQuery({
    queryKey: ['getAssignee', id, source],
    queryFn: async () => {
      try {
        const response = await axios.get(`/brand/${id}/assignee`, { params: { source } })
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id && !!source && fetch,
  })

  return { list: data?.list, ...rest }
}