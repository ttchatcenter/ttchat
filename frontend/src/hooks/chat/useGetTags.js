import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetTags(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getTags', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/chat/${id}/tags`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
  })

  return { brand_tags: data?.brand_tags, chat_tags: data?.chat_tags, ...rest }
}