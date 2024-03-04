import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useCreateFacebookPlatform(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/platform/facebook', data)
      return response.data
    },
    onSuccess,
    onError,
  })

  const createFacebookPlatform = (brand_id, user, pages) => {
    const data = pages.map((page) => ({
      access_token: page.access_token,
      name: page.name,
      id: page.id,
      fb_user_id: user.authResponse.userID,
      brand_id: brand_id,
    }))
    mutate(data)
  }

  return { ...result, createFacebookPlatform }
}
