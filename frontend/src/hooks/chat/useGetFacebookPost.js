import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useGetFacebookPost(id) {
  const { data, ...rest } = useQuery({
    queryKey: ['getFacebookPost', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/facebook-post/${id}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: !!id,
    keepPreviousData: true,
  })

  return { post: data?.post, ...rest }
}