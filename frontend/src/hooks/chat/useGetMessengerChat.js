import { useState, useEffect } from 'react'
import axios from '@/libs/axios'
import useGetPlatform from '../platform/useGetPlatform'

export default function useGetMessengerChat(data) {
  
  const [list, setList] = useState([])
  const [prev, setPrev] = useState()
  const { platform } = useGetPlatform(data?.platform_id)
<<<<<<< HEAD
  //alert(data?.platform_id)
=======
  alert(data?.platform_id)
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
  const fetchChat = (callback) => {
    window.FB.api(
      `${platform.platform_id}/conversations?user_id=${data?.customer_id}&fields=senders,messages.limit(25){message,from,created_time,sticker,attachments{image_data,video_data,file_url,name}}&limit=1`,
      { access_token: platform.platform_secret },
      async (response) => {
        if (response?.data?.[0]) {
          callback(response?.data?.[0])
        }
      }
    )
  }

  const syncChat = () => {
    fetchChat((data) => {
      const concatList = [...data.messages?.data, ...list]
      const newList = concatList.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
      setList(newList)
    })
  }

  const handleScroll = async () => {
    const response = await axios.get(prev)
    setPrev(response.data.paging.next)
    setList([...list, ...response.data.data])
  }

  useEffect(() => {
    if (platform) {
      fetchChat((data) => {
        setList(data.messages?.data)
        setPrev(data.messages?.paging?.next)
      })
    }
  }, [platform])

  useEffect(() => {
    if (data?.platform_id && platform) {
      const id = setInterval(syncChat, 10000)
      return () => {
        clearInterval(id)
      }
    }
  }, [data?.platform_id, platform, list])

  return {
    chat: list,
    platform,
    handleScroll,
    canScroll: !!prev,
    syncChat,
  }
}