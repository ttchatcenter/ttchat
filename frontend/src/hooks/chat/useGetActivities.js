import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetActivities(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getActivities', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/chat/${id}/activities`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    refetchInterval: 5000,
    enabled: !!id,
  })

  return { activities: data?.activities, ...rest }
}