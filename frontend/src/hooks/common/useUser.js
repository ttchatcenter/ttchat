import { useEffect } from 'react'
import { Modal } from 'antd'
import Router from 'next/router'
import axios from '@/libs/axios'
import config from '@/configs'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

export default function useUser({
  redirectIfNotFound = '',
  redirectIfFound = '',
  isIndexPage = false
} = {}) {
  const { data, ...rest } = useQuery({
    queryKey: ['getLoginUserProfile'],
    queryFn: async () => {
      try {
        const userSession = window.localStorage.getItem(config.userSessionKey)
        if (!userSession) {
          return null
        }
        if (dayjs().unix() - dayjs(JSON.parse(userSession).loginTime).unix() >= config.userSessionExpired) {
          await axios.delete('/auth/logout')
          Modal.info({
            title: 'Your session is expired',
            content: 'Your session is expired. Please log in again',
            okButtonProps: {
              className:
                "!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red",
            },
          })
          return null
        }
        const data = JSON.parse(userSession)
        window.localStorage.setItem(config.userSessionKey, JSON.stringify({ ...data, loginTime: dayjs() }))
        const response = await axios.get('/auth/user')
        return response.data  
      } catch (error) {
        return null
      }
    },
    enabled: typeof window !== 'undefined' && !!window.localStorage.getItem(config.userSessionKey)
  })

  useEffect(() => {
    if (!rest.isFetched && !isIndexPage) {
      return
    }
    if (redirectIfFound && data) {
      if (data?.is_reset_password) {
        Router.push('/new-password')
      } else if (data?.should_change_password) {
        Router.push('/expired-password')
      }
      Router.push(redirectIfFound)
      return
    }

    if (redirectIfNotFound && !data) {
      Router.push(redirectIfNotFound)
      return
    }
  }, [data, rest.isFetched, isIndexPage, redirectIfFound, redirectIfNotFound])

  return { user: data, ...rest }
}