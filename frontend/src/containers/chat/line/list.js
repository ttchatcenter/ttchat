import Tag from "@/components/Tag"
import dayjs from "dayjs"
import { useState } from "react"
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { Input, Modal } from "antd"
import {
  SendOutlined,
  PictureOutlined,
} from "@ant-design/icons"
import useGetLineChat from "@/hooks/chat/useGetLineChat"
import useLineReplied from "@/hooks/chat/useLineReplied";
import useUploadChatImage from '@/hooks/chat/useUploadChatImage';
import EmojiPicker from '../emojiPicker';
import QuickReply from '../quickReply';

dayjs.extend(buddhistEra); 
dayjs.locale("th");

const { TextArea } = Input

const List = ({ data }) => {
  const [text, setText] = useState('')
  const { chat, refetch } = useGetLineChat(data?.id)

  const { uploadImage } = useUploadChatImage({
    onSuccess: async (response) => {
      reply(data?.id, response.url, true)
      document.getElementById('input-upload').value = ''
    },
  })


  const { reply } = useLineReplied({
    onSuccess: () => {
      refetch()
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
    try {
      uploadImage({ image: e.target.files?.[0] })
    } catch (error) {
      console.log(error)
    }
  }

  const handleQuickReply = async (message) => { 
    await reply(data?.id, message.message)
    for (let i = 0; i < message?.quick_reply_image?.length; i++) {
      await reply(data?.id, message?.quick_reply_image?.[i]?.image, true)
    }
  } 

  const chatList = chat?.reduce((acc, cur) => {
    const createdAt = dayjs(cur.created_at)
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
            if(message.sender === 'user') {
              let content = message.content
              if (message.type === 'image') {
                const link = JSON.parse(message.content).link
                content = (
                  <img src={link} className='cursor-pointer' onClick={() => handleClickImage(link)} />
                )
              } else if (message.type === 'sticker') {
                content = (
                  <img src={message.content} className='cursor-pointer' onClick={() => handleClickImage(message.content)} />
                )
              } else if (message.type === 'video' || message.type === 'audio') {
                const link = JSON.parse(message.content).link
                content = (
                  <video controls>
                    <source src={link} type="video/mp4" />
                  </video>
                )
              } else if (message.type === 'file') {
                const msg = JSON.parse(message.content)
                const link = msg.link
                content = (
                  <a
                    href={link}
                    download={msg.fileName}
                    className="text-main-orange underline break-all"
                  >
                    {msg.fileName}
                  </a>
                )
              }
              acc.push(
                <div key={message.id} className="flex gap-1">
                  <img
                    className="w-[60px] h-[60px] rounded-full object-cover"
                    src={data?.customer_profile}
                  />
                  <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                    <div className="absolute border-transparent border-y-[10px] border-r-[20px] border-r-accent-light-bg2 right-[calc(100%-10px)]" />
                    <div className="bg-accent-light-bg2 rounded-lg text-accent-grey py-2 px-5 break-words	">
                      { content }
                    </div>
                  </div>
                  <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_at).format('HH:mm')}</div>
                </div>
              )
            } else {
              let content = message.content
              if (message.type === 'image') {
                content = (
                  <img src={message.content} className='cursor-pointer' onClick={() => handleClickImage(message.content)} />
                )
              }
              acc.push(
                <div key={message.id} className="flex gap-1 flex-row-reverse">
                  <div className="relative flex typo-th-b2 max-w-[60%] ml-[10px] h-fit mt-auto">
                    <div className="absolute border-transparent border-y-[10px] border-l-[20px] border-l-main-orange left-[calc(100%-10px)]" />
                    <div className="bg-main-orange rounded-lg text-main-white py-2 px-5 break-words	whitespace-pre-wrap">
                      {content}
                    </div>
                  </div>
                  <div className="typo-th-d1 text-main-grey4 mt-auto">{dayjs(message?.created_at).format('HH:mm')}</div>
                </div>
              )
            }
          })
          acc.push(
            <div  key={`${cur.id}_${Math.random()}`} className="mx-auto bg-accent-orange-bg1 text-main-orange typo-th-d1 py-1 px-3 rounded">
              {cur}
            </div>
          )
          return acc
        }, [])}
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

export default List