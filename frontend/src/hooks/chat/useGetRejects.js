import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetRejects(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getRejects'],
    queryFn: async () => {
      try {
        const response = await axios.get(`/rejects`)
        return response.data  
      } catch (error) {
        return null
      }
    },
  })

  return { list: data, ...rest }
}