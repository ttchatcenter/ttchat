import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetTag(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getTag', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/pantip-tag/${id}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    keepPreviousData: true,
  })

  return { tag: data, ...rest }
}