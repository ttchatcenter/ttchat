import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetCrm(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getCrm', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/brand/${id}/crm`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    keepPreviousData: true,
  })

  return { crm: data?.data, ...rest }
}