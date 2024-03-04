import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useUploadChatImage(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ data }) => {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const response = await axios.post(`/chat/image`, data, options)
      return response.data
    },
    onSuccess,
    onError,
  })

  const uploadImage = (data) => {
    const {
      image
    } = data
    mutate({
      data: {
        image,
      }
    })
  }

  return { ...result, uploadImage }
}
