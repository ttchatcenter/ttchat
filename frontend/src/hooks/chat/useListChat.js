import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListChat(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getChatList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/chat', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!params.brand_id,
    refetchInterval: 5000,
    keepPreviousData: true,
  })

  return { chats: data?.chats || [], total: data?.total, ...rest }
}