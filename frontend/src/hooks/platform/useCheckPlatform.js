import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useCheckPlatform(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['checkPlatform', id],
    queryFn: async () => {
      try {
        const response = await axios.get("/platform/check", { params: { id } })
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id.length,
    keepPreviousData: true,
  })

  return { platform: data, ...rest }
}