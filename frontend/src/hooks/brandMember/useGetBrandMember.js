import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetBrandMember(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getBrandMember', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/brand-member/${id}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    keepPreviousData: true,
  })

  return { member: data, ...rest }
}