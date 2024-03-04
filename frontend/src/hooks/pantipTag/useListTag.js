import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListTag(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getPantipTagList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/pantip-tag', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!params?.brand_id,
    keepPreviousData: true,
  })

  return { tags: data?.tags || [], total: data?.total, ...rest }
}