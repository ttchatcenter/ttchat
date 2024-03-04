import axios from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

export default function useCheckHidden(id, token) {
  const { data, ...rest } = useQuery({
    queryKey: ['getTags', id],
    queryFn: async () => new Promise((resolve) => {
      FB.api(
        `/${id}?access_token=${token}&fields=is_hidden`,
        function (response) {
          if (response && !response.error) {
            /* handle the result */
            return resolve(response)
          } else {
            return resolve(true)
          }
        }
      );
    }),
    enabled: !!id && !!token,
  })

  return { hidden: data?.is_hidden && true, ...rest }
}