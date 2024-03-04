import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListPlatform(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getPlatformList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/platform', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
  })

  return { platforms: data?.platforms || [], total: data?.total, ...rest }
}