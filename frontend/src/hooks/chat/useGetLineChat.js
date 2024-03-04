import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetLineChat(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getLineChat', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/line-chat/${id}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    refetchInterval: 5000,
    keepPreviousData: true,
  })

  return { chat: data?.chat, ...rest }
}