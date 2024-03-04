import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListUser(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getUserList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/user', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
  })

  return { users: data?.users || [], total: data?.total, ...rest }
}