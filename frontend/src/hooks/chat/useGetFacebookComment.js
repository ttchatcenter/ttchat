import { useState, useEffect } from 'react'
import axios from '@/libs/axios'
import useGetPlatform from '../platform/useGetPlatform'
import useGetFacebookPost from './useGetFacebookPost'

export default function useGetFacebookComment(data) {
  const [list, setList] = useState([])
  const [prev, setPrev] = useState()
  const [fetched, setFetched] = useState(false)
  const [fbPost, setFbPost] = useState()
  const [pageProfile, setPageProfile] = useState()
  const { platform } = useGetPlatform(data?.platform_id)
  const { post } = useGetFacebookPost(data?.id)

  const fetchPage = (callback) => {
    window.FB.api(`${platform?.platform_id}/picture?redirect=0`, { access_token: platform.platform_secret },
      async (response) => {
        if (response?.data) {
          callback(response?.data?.url)
        }
      }
    )
  }
  const fetchPost = (id, callback) => {
    window.FB.api(`${id}?fields=full_picture,message,created_time`, { access_token: platform.platform_secret },
      async (response) => {
        callback(response)
      }
    )
  }

  const fetchChat = (id, callback) => {
    window.FB.api(`${id}/comments?fields=id,message,attachment,created_time,from,comments,parent{id,message,attachment,created_time,from,comments,is_hidden},is_hidden`, { access_token: platform.platform_secret },
      async (response) => {
        if (response) {
          const data = response?.data?.reduce((acc, cur) => {
            const { comments, parent, ...rest } = cur
            if (acc.length === 0) {
              acc.push(parent)
            }
            acc.push(rest)
            if (comments) {
              comments?.data?.forEach(i => {
                acc.push(i)
              });
            }
            return acc
          }, [])
          callback({ ...response, data })
        }
      }
    )
  }

  const syncChat = (id) => {
    if (id) {
      fetchChat(id, (response) => {
        const concatList = [...response?.data, ...list]
        const newList = concatList.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
        setList(newList)
      })
    }
  }

  const handleScroll = async () => {
    const response = await axios.get(prev)
    setPrev(response.data.paging.next)
    setList([...list, ...response.data.data])
  }

  useEffect(() => {
    if (post?.post_id && platform?.platform_secret) {
      fetchPost(post?.post_id, (data) => {
        setFbPost({ ...post, data })
      })
      fetchChat(post?.comment_id, (resp) => {
        setList(resp?.data)
        setPrev(resp?.paging?.next)
        setFetched(true)
      })
    }
  }, [post, platform])

  useEffect(() => {
    if (post?.comment_id && platform?.platform_secret) {
      const id = setInterval(() => syncChat(post?.comment_id), 10000)
      return () => {
        clearInterval(id)
      }
    }
  }, [post, platform, list])

  useEffect(() => {
    if (post?.post_id && platform?.platform_id) {
      fetchPage((data) => {
        setPageProfile(data)
      })
    }
  }, [platform])

  return {
    post: fbPost,
    chat: list,
    platform,
    pageProfile,
    handleScroll,
    canScroll: !!prev,
    syncChat,
    fetched,
  }
}