import { useState } from 'react'
import ChatList from './chatList'
import Messenger from './messenger/layout'
import Line from './line/layout'
import Facebook from './facebook/layout'
import Pantip from './pantip/layout'
import Twitter from './twitter/layout'
<<<<<<< HEAD
//import Inbox from './inbox/layout'
//import Dm from './dm/layout'
=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
import useBrand from "@/hooks/common/useBrand"
import useListChat from "@/hooks/chat/useListChat"

const ChatPage = () => {
  
  const [selected, setSelected] = useState()
  const [filter, setFilter] = useState({
    keyword: '',
    status: ['new', 'assigned', 'replied'],
<<<<<<< HEAD
    source: ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter' ,'dm'],
=======
    source: ['facebook', 'messenger', 'line', 'pantip','twitter'],
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
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
<<<<<<< HEAD
    // } else if (selected.source === 'inbox') {
    //   return <Inbox data={data} setSelected={setSelected} />  
    } else if (selected.source === 'twitter') {
      return <Twitter data={data} setSelected={setSelected} />
    // } else if (selected.source === 'dm') {
    //   return <Dm data={data} setSelected={setSelected} />  
=======
    } else if (selected.source === 'twitter') {
      return <Twitter data={data} setSelected={setSelected} />
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
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