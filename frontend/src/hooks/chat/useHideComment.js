import { useMutation } from '@tanstack/react-query'
import axios from '@/libs/axios'

export default function useHideComment(props = {}) {
  const { onSuccess, onError } = props
  const { mutate, ...result } = useMutation({
    mutationFn: async ({ id, token }) => new Promise((resolve, reject) => {
      FB.api(
        `/${id}?access_token=${token}`,
        'POST',
        {
          'is_hidden': true
        },
        function (response) {
          if (response && !response.error) {
            /* handle the result */
            return resolve(response)
          } else {
            return reject(response)
          }
        }
      );
    }),
    onSuccess,
    onError,
  })

  const hide = (id, token) => {
    mutate({ id, token })
  }

  return { ...result, hide }
}
