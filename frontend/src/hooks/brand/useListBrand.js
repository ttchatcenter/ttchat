import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useListBrand(params) {
  const { data, ...rest } = useQuery({
    queryKey: ['getBrandList', params],
    queryFn: async () => {
      try {
        const response = await axios.get('/brand', { params })
        return response.data  
      } catch (error) {
        return null
      }
    },
    keepPreviousData: true,
  })

  return { brands: data?.brands || [], total: data?.total, ...rest }
}