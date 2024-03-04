import { useEffect, useState } from 'react'
import Tag from "@/components/Tag"
import dayjs from "dayjs"
import "dayjs/locale/th";
import relativeTime from 'dayjs/plugin/relativeTime'
import buddhistEra from "dayjs/plugin/buddhistEra";
import { Input, Modal } from "antd"
import axios from 'axios'
import {
  EyeInvisibleOutlined,
  SendOutlined,
  PictureOutlined,
} from "@ant-design/icons"
import useGetFacebookComment from "@/hooks/chat/useGetFacebookComment";
import useFacebookReplied from '@/hooks/chat/useFacebookReplied';
import useUploadChatImage from '@/hooks/chat/useUploadChatImage';
import EmojiPicker from '../emojiPicker';
import QuickReply from '../quickReply';
import useHideComment from '@/hooks/chat/useHideComment';
import useCheckHidden from '@/hooks/chat/useCheckHidden';

dayjs.extend(relativeTime)
dayjs.extend(buddhistEra); 
dayjs.locale("th");

const { TextArea } = Input

// TODO:: refactor
const replyFile = async (platform, comment_id, link) => {
  const payload = {
    access_token: platform.platform_secret,
    attachment_url: link,
  }
  const resp = await axios.post(
    `https://graph.facebook.com/v14.0/${comment_id}/comments?access_token=${platform.platform_secret}`,
    payload,
  )

  return resp
}

const List = ({ data }) => {
  const [text, setText] = useState('')
  const {
    post,
    chat: chats,
    platform,
    pageProfile,
    canScroll,
    handleScroll,
    syncChat,
    fetched,
  } = useGetFacebookComment(data)

  const { hide } = useHideComment({
    onSuccess: () => {
      Modal.info({
        title: 'Hidden Comment Success',
        okButtonProps: {
          className:
            "!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red",
        },
      })
    },
    onError: (error) => {
      console.log(error)
      Modal.error({
        title: 'Hidden Comment Failed',
        content: `${error.error.message} (fb_traceid: ${error.error.fbtrace_id})`,
        okButtonProps: {
          className:
            "!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red",
        },
      })
    }
  })

  const { hidden } = useCheckHidden(post?.comment_id, platform?.platform_secret)

  const chat = chats.length ? chats : (fetched ? [{
    created_time: data?.latest_message_time,
    from: { name: data?.customer_name, id: data?.customer_id },
    id: post?.comment_id,
    message: data?.latest_message,
    is_hidden: hidden,
  }] : [])
  
  const { reply } = useFacebookReplied({
    onSuccess: () => {
      syncChat(post?.comment_id)
    }
  })

  const { uploadImage } = useUploadChatImage({
    onSuccess: async (response) => {
      const comment_id = [...chat].reverse().find(i => i?.from?.id == data?.customer_id)?.id
      await replyFile(platform, comment_id, response.url)
      reply(data?.id, comment_id, 'Send an Image', true)
      document.getElementById('input-upload').value = ''
    },
  })

  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        const comment_id = [...chat].reverse().find(i => i?.from?.id == data?.customer_id)?.id
        reply(data?.id, comment_id, text)
        e.preventDefault();
        setText('')
      }
    }
  }

  const handleClickUploadIcon = () => {
    document.getElementById('input-upload').click()
  }

  const handleQuickReply = async (message) => { 
    const comment_id = [...chat].reverse().find(i => i?.from?.id == data?.customer_id)?.id
    await reply(data?.id, comment_id, message.message)
    for (let i = 0; i < message?.quick_reply_image?.length; i++) {
      await replyFile(platform, comment_id, message?.quick_reply_image?.[i]?.image)
    }
    if (message?.quick_reply_image?.length) {
      await reply(data?.id, comment_id, 'Send an Image', true)
    }
  } 

  const handleSend = () => {
    const comment_id = [...chat].reverse().find(i => i?.from?.id == data?.customer_id)?.id
    reply(data?.id, comment_id, text)
    setText('')
  }

  const handleFileChange = async (e) => {    
    try {
      uploadImage({ image: e.target.files?.[0] })
    } catch (error) {
      console.log(error)
    }
  }

  const chatList = chat?.reduce((acc, cur) => {
    const createdAt = dayjs(cur.created_time)
    const key = `วัน${createdAt.format('ddd, D MMMM BBBB')}`
    if (acc[key]) {
      acc[key].push(cur)
    } else {
      acc[key] = [cur]
    }
    return acc
  }, {}) || {}

  const handleClickHide = (id, token) => {
    Modal.confirm({
      title: "Confirm to hidden the comment",
      onOk: () => hide(id, token),
      okButtonProps: {
        className:
          "!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red",
      },
      cancelButtonProps: {
        className: "hover:!border-main-orange hover:!text-main-orange",
      },
    })
  }

  const handleClickImage = (link) => {
    Modal.info({
      icon: <div />,
      closable: true,
      centered: true,
      width: 'content-width',
      content: (
        <img src={link} className='max-h-[80vh]' />
      ),
      footer: null
    })
  }

  return (
    <div className="flex flex-col w-full h-full border-main-grey3 border-r">
      {/* title */}
      <div className="py-4 px-4 flex gap-[10px] border-main-grey3 border-b">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={data?.customer_profile}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="typo-th-b2 text-accent-body-text">{data?.customer_name}</span>
            <Tag text={data?.status} />
          </div>
          <div className="typo-th-c3 text-accent-grey">โพสต์เมื่อ {dayjs(data?.latest_message_time).fromNow()}</div>
        </div>
      </div>
      {/* list */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-scroll max-h-[calc(100vh-81px-79px-140px)]">
        {Object.keys(chatList).reduce((acc, cur) => {
          acc.push(
            <div key={`${cur.id}_${Math.random()}`} className="mx-auto bg-accent-orange-bg1 text-main-orange typo-th-d1 py-1 px-3 rounded">
              {cur}
            </div>
          )
          chatList[cur].forEach((message) => {
            if (message?.from?.id == data?.customer_id) {
              let content = message.message
              if (message.sticker) {
                content = (
                  <img src={message.sticker} className='cursor-pointer' onClick={() => handleClickImage(message.sticker)} />
                )
              } else if (message.attachment?.media?.image?.src) {
                content = (
                  <img
                    src={message.attachment?.media?.image?.src}
                    className='cursor-pointer'
                    onClick={() => handleClickImage(message.attachment?.media?.image?.src)}  
                  />
                )
              }
              acc.push(
                <div id={message.id} key={message.id} className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <img
                      className="w-[60px] h-[60px] rounded-full object-cover"
                      src={data?.customer_profile}
                    />
                    <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                      <div className="bg-accent-light-bg2 rounded-lg text-accent-grey py-2 px-5 break-all	whitespace-pre-wrap">
                        <div className='font-bold'>{message?.from?.name}</div>
                        <div>{content}</div>
                      </div>
                    </div>
                    <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_time).format('HH:mm')}</div>
                  </div>
                  {
                    !message?.is_hidden ? (
                      <div className="flex justify-start pl-[68px] gap-4 typo-th-c3 text-main-grey4">
                        <div className="flex gap-1 cursor-pointer" onClick={() => handleClickHide(message?.id, platform?.platform_secret)}>
                          <EyeInvisibleOutlined />
                          <span className="underline">Hide comment</span>
                        </div>
                      </div>
                    ) : undefined
                  }
                </div>
              )
            } else if (message?.from?.id == platform?.platform_id) {
              let content = message.message
              if (message.sticker) {
                content = (
                  <img src={message.sticker} className='cursor-pointer' onClick={() => handleClickImage(message.sticker)} />
                )
              } else if (message.attachment?.media?.image?.src) {
                content = (
                  <img
                    src={message.attachment?.media?.image?.src}
                    className='cursor-pointer'
                    onClick={() => handleClickImage(message.attachment?.media?.image?.src)}  
                  />
                )
              }
              acc.push(
                <div id={message.id} key={message.id} className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <img
                      className="w-[60px] h-[60px] rounded-full object-cover"
                      src={pageProfile}
                    />
                    <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                      <div className="bg-accent-light-bg2 rounded-lg text-accent-grey py-2 px-5 break-all	whitespace-pre-wrap">
                        <div className='font-bold'>{message?.from?.name}</div>
                        <div>{content}</div>
                      </div>
                    </div>
                    <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_time).format('HH:mm')}</div>
                  </div>
                </div>
              )
            } else {
              let content = message.message
              if (message.sticker) {
                content = (
                  <img src={message.sticker} className='cursor-pointer' onClick={() => handleClickImage(message.sticker)} />
                )
              } else if (message.attachment?.media?.image?.src) {
                content = (
                  <img
                    src={message.attachment?.media?.image?.src}
                    className='cursor-pointer'
                    onClick={() => handleClickImage(message.attachment?.media?.image?.src)}
                  />
                )
              }
              acc.push(
                <div id={message.id} key={message.id} className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <img
                      className="w-[60px] h-[60px] rounded-full object-cover"
                      src={data?.customer_profile}
                    />
                    <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                      <div className="bg-accent-light-bg2 rounded-lg text-accent-grey py-2 px-5 break-all	whitespace-pre-wrap">
                        <div className='font-bold'>{message?.from?.name || 'Anonymous'}</div>
                        <div>{content}</div>
                      </div>
                    </div>
                    <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_time).format('HH:mm')}</div>
                  </div>
                  {
                    !message?.is_hidden ? (
                      <div className="flex justify-start pl-[68px] gap-4 typo-th-c3 text-main-grey4">
                        <div className="flex gap-1 cursor-pointer" onClick={() => handleClickHide(message?.id, platform?.platform_secret)}>
                          <EyeInvisibleOutlined />
                          <span className="underline">Hide comment</span>
                        </div>
                      </div>
                    ) : undefined
                  }
                </div>
              )
            }
          })
          return acc
        }, [])}
        {
          canScroll ? (
            <MyObserver
              selector={chat[chat.length - 4].id}
              callback={(e) => {
                if (e[0].isIntersecting) {
                  handleScroll()
                }
              }}
            />
          ) : undefined
        }
      </div>
      {/* text field */}
      <div className="p-4 flex flex-col [&_*]:!typo-th-c3">
        <TextArea
          rows={4}
          placeholder="พิมพ์ข้อความเพื่อตอบกลับ"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className='flex gap-1 items-center justify-end'>
          <EmojiPicker setText={setText} />
          <QuickReply handleSelectMessage={handleQuickReply} />
          <PictureOutlined style={{ color: '#CBD9D1' }} onClick={handleClickUploadIcon} />
          <SendOutlined style={{ color: '#CBD9D1' }} onClick={handleSend} />
          <input
            id="input-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  )
}

const MyObserver = ({ selector, callback }) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => callback(entries), {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    })
    const element = document.getElementById(selector)
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [selector, callback])
  return null
}

export default List