import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListQuickReply(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getQuickReplyList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/chat-quick-reply', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.brand_id,
  })

  return { list: data?.data || [], ...rest }
}