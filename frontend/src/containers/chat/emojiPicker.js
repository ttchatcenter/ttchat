import { useState } from 'react'
import facebookEmojiData from '@emoji-mart/data/sets/14/facebook.json'
import { SmileOutlined } from '@ant-design/icons'
import Picker from '@emoji-mart/react'
import { Popover as APopover } from 'antd'

export default function EmojiPicker({ setText }) {
  const [open, setOpen] = useState(false)

  function handleOpenChange(newOpen) {
    setOpen(newOpen)
  }

  function handleInsertEmoji(emoji) {
    setText((text) => (text || '') + emoji.native)
  }

  return (
    <>
      <div>
        <APopover
          overlayClassName="emoji-picker-popover"
          content={
            <Picker
              data={facebookEmojiData}
              onEmojiSelect={handleInsertEmoji}
              theme="light"
              set="facebook"
            />
          }
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <SmileOutlined style={{ color: '#CBD9D1' }} />
        </APopover>
      </div>
    </>
  )
}

