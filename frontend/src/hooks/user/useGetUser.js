import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetUser(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getUser', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/user/${id}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    keepPreviousData: true,
  })

  return { user: data, ...rest }
}