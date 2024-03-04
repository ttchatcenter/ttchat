import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'
import config from '@/configs'

export default function useBrand() {

  const { data, ...rest } = useQuery({
    queryKey: ['getCurrentBrand'],
    queryFn: async () => {
      try {
        if (!window.localStorage.getItem(config.userSessionKey)) {
          return null
        }
        const response = await axios.get(`brand/${window.localStorage.getItem(config.brandSessionKey)}`)
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: typeof window !== 'undefined' && !!window.localStorage.getItem(config.brandSessionKey)
  })

  return { brand: data, ...rest }
}