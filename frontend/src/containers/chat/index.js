import { useState } from 'react'
import ChatList from './chatList'
import Messenger from './messenger/layout'
import Line from './line/layout'
import Facebook from './facebook/layout'
import Pantip from './pantip/layout'
import useBrand from "@/hooks/common/useBrand"
import useListChat from "@/hooks/chat/useListChat"

const ChatPage = () => {
  
  const [selected, setSelected] = useState()
  const [filter, setFilter] = useState({
    keyword: '',
    status: ['new', 'assigned', 'replied'],
    source: ['facebook', 'messenger', 'line', 'pantip'],
    platform_id: [],
    assignee: [],
  })

  const { brand } = useBrand()

  const { chats } = useListChat({
    brand_id: brand?.id || undefined,
    ...filter
  })

  const renderChat = () => {
    const data = chats?.find(i => i.id === selected.id)
    if (selected.source === 'messenger') {
      return <Messenger data={data} setSelected={setSelected} />
    } else if (selected.source === 'line') {
      return <Line data={data} setSelected={setSelected} />
    } else if (selected.source === 'facebook') {
      return <Facebook data={data} setSelected={setSelected} />
    } else if (selected.source === 'pantip') {
      return <Pantip data={data} setSelected={setSelected} />
    }
    return undefined
  }

  return (
    <div className="grid grid-cols-[348fr_812fr] h-full text-accent-body-text">
      <ChatList
        chats={chats}
        setSelected={setSelected}
        filter={filter}
        setFilter={setFilter}
      />
      {
        selected ? renderChat() : undefined
      }
    </div>
  )
}

export default ChatPage