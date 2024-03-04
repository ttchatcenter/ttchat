import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetPlatform(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getPlatform', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/platform/${id}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    keepPreviousData: true,
  })

  return { platform: data, ...rest }
}