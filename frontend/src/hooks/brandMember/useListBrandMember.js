import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListBrandMember(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getBrandMemberList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/brand-member', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
    enabled: !!params?.brand_id,
  })

  return { members: data?.members || [], total: data?.total, ...rest }
}