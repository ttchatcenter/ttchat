import { useEffect, useState } from 'react'
import dayjs from "dayjs"
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import Tag from "@/components/Tag"
import axios from 'axios'
import {
  SendOutlined,
  PictureOutlined,
} from "@ant-design/icons"
import { Input, Modal } from "antd"
import useGetMessengerChat from '@/hooks/chat/useGetMessengerChat'
import useMessengerReplied from "@/hooks/chat/useMessengerReplied";
import EmojiPicker from '../emojiPicker';
import QuickReply from '../quickReply';

dayjs.extend(buddhistEra); 
dayjs.locale("th");

const { TextArea } = Input

// TODO:: refactor
const replyFile = async (platform, recipient_id, file, type) => {
  let payload = null
  let fileType = 'file'

  if (file instanceof File) {
    if (file.type.includes('image')) {
      fileType = 'image'
    } else if (file.type.includes('video')) {
      fileType = 'video'
    } else if (file.type.includes('audio')) {
      fileType = 'audio'
    }

    payload = {
      recipient: JSON.stringify({ id: recipient_id }),
      message: JSON.stringify({
        attachment: {
          type: fileType,
          payload: {
            is_reusable: true,
          },
        },
      }),
      filedata: file,
    }
  } else {
    fileType = 'image'
    payload = {
      recipient: JSON.stringify({ id: recipient_id }),
      message: JSON.stringify({
        attachment: {
          type: fileType,
          payload: {
            url: file,
            is_reusable: true,
          },
        },
      }),
      filedata: file,
      messaging_type: 'MESSAGE_TAG',
      tag: 'POST_PURCHASE_UPDATE',
    }
  }

  const resp = await axios.post(
    `https://graph.facebook.com/v14.0/me/messages?access_token=${platform.platform_secret}`,
    payload,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return resp
}

const List = ({ data }) => {
  const [text, setText] = useState('')
  const {
    chat,
    platform,
    canScroll,
    handleScroll,
    syncChat,
  } = useGetMessengerChat(data)

  const { reply } = useMessengerReplied({
    onSuccess: () => {
      syncChat()
    }
  })

  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        reply(data?.id, text)
        e.preventDefault();
        setText('')
      }
    }
  }

  const handleClickUploadIcon = () => {
    document.getElementById('input-upload').click()
  }

  const handleSend = () => {
    reply(data?.id, text)
    setText('')
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    try {
      await replyFile(platform, data?.customer_id, file, 'TAG')
      reply(data?.id, 'Send an Image', true)
    } catch (error) {
      console.log(error)
    }

    document.getElementById('input-upload').value = ''
  }

  const handleQuickReply = async (message) => { 
    await reply(data?.id, message.message)
    for (let i = 0; i < message?.quick_reply_image?.length; i++) {
      await replyFile(platform, data?.customer_id, message?.quick_reply_image?.[i]?.image, 'TAG')
    }
    if (message?.quick_reply_image?.length) {
      await reply(data?.id, 'Send an Image', true)
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
      <div className="py-6 px-9 flex items-center justify-between border-main-grey3 border-b">
        <span className="typo-th-b2 text-accent-body-text font-semibold">{data?.customer_name}</span>
        <Tag text={data?.status} customClasses="!px-2" />
      </div>
      {/* list */}
      <div className="flex-1 flex flex-col-reverse p-4 gap-4 overflow-y-scroll max-h-[calc(100vh-81px-79px-140px)]">
        {Object.keys(chatList).reduce((acc, cur) => {
          chatList[cur].forEach((message) => {
            if (message?.from?.id == data?.customer_id) {
              let content = message.message
              if (message.sticker) {
                content = (
                  <img src={message.sticker} className='cursor-pointer' onClick={() => handleClickImage(message.sticker)} />
                )
              } else if (message.attachments) {
                content = (
                  <div key={message.id}>
                    {message.attachments.data.map((attachment) => {
                      if (attachment.image_data) {
                        return (
                          <img
                            key={attachment.id}
                            src={attachment.image_data.url}
                            className='cursor-pointer'
                            onClick={() => handleClickImage(attachment.image_data.url)}
                          />
                        )
                      } else if (attachment.video_data) {
                        const [type, ...name] = attachment.name.split('.').reverse()
                        let newName = name.reverse().join('')
                        if (newName.length >= 20) {
                          newName = newName.substring(0, 17) + '...'
                        }
                        return (
                          <a
                            key={attachment.id}
                            href={attachment.video_data.url}
                            target="_blank"
                          >
                            {`${newName}.${type}`}
                          </a>
                        )
                      } else if (attachment.file_url) {
                        const [type, ...name] = attachment.name.split('.').reverse()
                        let newName = name.reverse().join('')
                        if (newName.length >= 20) {
                          newName = newName.substring(0, 17) + '...'
                        }
                        return (
                          <a key={attachment.id} href={attachment.file_url} target="_blank">
                            {`${newName}.${type}`}
                          </a>
                        )
                      }
                    })}
                  </div>
                )
              }
              acc.push(
                <div id={message.id} key={message.id} className="flex gap-1">
                  <img
                    className="w-[60px] h-[60px] rounded-full object-cover"
                    src={data?.customer_profile}
                  />
                  <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                    <div className="absolute border-transparent border-y-[10px] border-r-[20px] border-r-accent-light-bg2 right-[calc(100%-10px)]" />
                    <div className="bg-accent-light-bg2 rounded-lg text-accent-grey py-2 px-5 break-all	whitespace-pre-wrap">
                      { content }
                    </div>
                  </div>
                  <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_time).format('HH:mm')}</div>
                </div>
              )
            } else {
              let content = message.message
              if (message.sticker) {
                content = (
                  <img src={message.sticker} className='cursor-pointer' onClick={() => handleClickImage(message.sticker)}/>
                )
              } else if (message.attachments) {
                content = (
                  <div key={message.id}>
                    {message.attachments.data.map((attachment) => {
                      if (attachment.image_data) {
                        return (
                          <img
                            key={attachment.id}
                            src={attachment.image_data.url}
                            className='cursor-pointer'
                            onClick={() => handleClickImage(attachment.image_data.url)}
                          />
                        )
                      } else if (attachment.video_data) {
                        const [type, ...name] = attachment.name.split('.').reverse()
                        let newName = name.reverse().join('')
                        if (newName.length >= 20) {
                          newName = newName.substring(0, 17) + '...'
                        }
                        return (
                          <a
                            key={attachment.id}
                            href={attachment.video_data.url}
                            target="_blank"
                          >
                            {`${newName}.${type}`}
                          </a>
                        )
                      } else if (attachment.file_url) {
                        const [type, ...name] = attachment.name.split('.').reverse()
                        let newName = name.reverse().join('')
                        if (newName.length >= 20) {
                          newName = newName.substring(0, 17) + '...'
                        }
                        return (
                          <a key={attachment.id} href={attachment.file_url} target="_blank">
                            {`${newName}.${type}`}
                          </a>
                        )
                      }
                    })}
                  </div>
                )
              }
              acc.push(
                <div id={message.id} key={message.id} className="flex gap-1 flex-row-reverse">
                  <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                    <div className="absolute border-transparent border-y-[10px] border-l-[20px] border-l-main-orange left-[calc(100%-10px)]" />
                    <div className="bg-main-orange rounded-lg text-main-white py-2 px-5 break-all	whitespace-pre-wrap">
                    { content }
                    </div>
                  </div>
                  <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_time).format('HH:mm')}</div>
                </div>
              )
            }
          })
          acc.push(
            <div key={`${cur.id}_${Math.random()}`} className="mx-auto bg-accent-orange-bg1 text-main-orange typo-th-d1 py-1 px-3 rounded">
              {cur}
            </div>
          )
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