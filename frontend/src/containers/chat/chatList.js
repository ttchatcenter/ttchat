import { useState, useEffect } from 'react'
import { Input, Tooltip, Checkbox } from "antd"
import {
  SearchOutlined,
  FilterFilled,
  UndoOutlined,
} from "@ant-design/icons"
import ChatListItem from "./chatListItem"
import useSeen from "@/hooks/chat/useSeen"
import useDebouncedCallback from "@/utils/useDebounceCallback"
import useBrand from '@/hooks/common/useBrand'
import useListPlatform from '@/hooks/platform/useListPlatform'
import useUser from '@/hooks/common/useUser'
import useListBrandMember from '@/hooks/brandMember/useListBrandMember'

const ChatList = (props) => {
  const { filter, setFilter } = props
  const [keyword, setKeyword] = useState('')
  const { user } = useUser()
  const { seen } = useSeen()
  const { brand } = useBrand()
  const isSup = ['super_admin', 'supervisor'].includes(user?.role)
  const { platforms } = useListPlatform({
    brand_id: brand?.id || undefined,
  })

  const { members } = useListBrandMember({
    brand_id: isSup && brand?.id,
  })

  const handleSelect = (i) => {
    props.setSelected(i)
    seen(i.id)
  }

  useEffect(() => {
    setFilter({ ...filter, keyword })
  }, [keyword])

  const debounceSetKeyword = useDebouncedCallback((value) => {
    setKeyword(value)
  }, 500)

  const handleChecked = (k, v) => (e) => {
    if (e.target.checked) {
      setFilter({ ...filter, [k]: [...filter[k], v] })
    } else {
      setFilter({ ...filter, [k]: [...filter[k]].filter(i => i !== v) })
    }
  }

  const tooltip = (
    <div className='flex flex-col gap-[10px] px-3 py-4 min-w-[265px] h-[375px] overflow-y-scroll'>
      {
        filter.status.length ||
        filter.source.length ||
        filter.platform_id.length ||
        filter.assignee.length ? (
          <div className='flex justify-end w-full gap-1 text-main-grey4 typo-th-c3'>
            <div
              className='flex gap-1 cursor-pointer'
              onClick={() => {
                setFilter({
                  ...filter,    
                  status: [],
                  source: [],
                  platform_id: [],
                  assignee: [],
                })
              }}
            >
              <span className='underline'>ยกเลิกตัวเลือกทั้งหมด</span>
              <UndoOutlined />
            </div>
          </div>
        ) : undefined
      }
      <div className='text-accent-grey'>Status</div>
      <div className='flex flex-col gap-2 [&_*]:typo-th-c3 [&_*]:text-accent-grey'>
        <Checkbox onChange={handleChecked('status', 'new')} checked={filter.status.find(i => i === 'new')}>New</Checkbox>
        <Checkbox onChange={handleChecked('status', 'assigned')} checked={filter.status.find(i => i === 'assigned')}>Assigned</Checkbox>
        <Checkbox onChange={handleChecked('status', 'replied')} checked={filter.status.find(i => i === 'replied')}>Replied</Checkbox>
        <Checkbox onChange={handleChecked('status', 'closed')} checked={filter.status.find(i => i === 'closed')}>Closed</Checkbox>
        <Checkbox onChange={handleChecked('status', 'rejected')} checked={filter.status.find(i => i === 'rejected')}>Rejected</Checkbox>
      </div>
      <div className='text-accent-grey'>Platform</div>
      <div className='flex flex-col gap-2 [&_*]:typo-th-c3 [&_*]:text-accent-grey'>
        <Checkbox onChange={handleChecked('source', 'facebook')} checked={filter.source.find(i => i === 'facebook')}>Facebook</Checkbox>
        <Checkbox onChange={handleChecked('source', 'messenger')} checked={filter.source.find(i => i === 'messenger')}>Messenger</Checkbox>
        <Checkbox onChange={handleChecked('source', 'line')} checked={filter.source.find(i => i === 'line')}>Line</Checkbox>
        <Checkbox onChange={handleChecked('source', 'pantip')} checked={filter.source.find(i => i === 'pantip')}>Pantip</Checkbox>
        <Checkbox onChange={handleChecked('source', 'inbox')} checked={filter.source.find(i => i === 'inbox')}>Pantip Inbox</Checkbox>
        <Checkbox onChange={handleChecked('source', 'twitter')} checked={filter.source.find(i => i === 'twitter')}>twitter</Checkbox>
        <Checkbox onChange={handleChecked('source', 'dm')} checked={filter.source.find(i => i === 'dm')}>twitter Dm</Checkbox>
      </div>
      <div className='text-accent-grey'>Channel</div>
      <div className='flex flex-col gap-2 [&_*]:typo-th-c3 [&_*]:text-accent-grey'>
        {
          platforms
            .filter(p => p.status === 'active')
            .map(p => (
              <Checkbox key={p.id} onChange={handleChecked('platform_id', p.id)} checked={filter.platform_id.find(i => i === p.id)}>{`${p.name} (${p.type})`}</Checkbox>
            ))
        }
      </div>
      {
        isSup ? (
          <>
            <div className='text-accent-grey'>Member</div>
            <div className='flex flex-col gap-2 [&_*]:typo-th-c3 [&_*]:text-accent-grey'>
              {
                members
                  .filter(p => p.status === 'active')
                  .map(p => (
                    <Checkbox key={p.id} onChange={handleChecked('assignee', p.user_id)} checked={filter.assignee.find(i => i === p.user_id)}>{`${p.display_name}`}</Checkbox>
                  ))
              }
            </div>
          </>
        ) : undefined
      }
    </div>
  )

  return (
    <div className="flex flex-col border-r border-main-grey2 h-[calc(100vh_-_81px)]">
      <div className="flex flex-col p-4 pt-6 gap-4 border-b border-main-grey3">
        <div className="flex gap-2">
          <Input
            className="rounded-full"
            placeholder="Search"
            onChange={(e) => debounceSetKeyword(e.target.value)}
            suffix={<SearchOutlined className="!text-main-grey3" />}
          />
          <Tooltip
            placement='bottom'
            title={tooltip}
            color="#FFFFFF"
          >
            <FilterFilled className="!text-main-grey3 mx-1 cursor-pointer" />
          </Tooltip>
        </div>
        <div className="typo-th-hl3">ข้อความทั้งหมด ({props?.chats?.length || 0})</div>
      </div>
      <div className="flex-1 overflow-y-scroll flex flex-col">
        {
          props?.chats?.map((i) => {
            return (
              <ChatListItem
                key={i.id}
                type={i.source}
                data={i}
                handleClick={() => handleSelect(i)}
              />
            )
          })
        }
        {/* {
          ['pantip'].map((type) => {
            return (
              <ChatListItem
                key={type}
                type={type}
                handleClick={() => props.setSelected({ source: type })}
              />
            )
          })
        } */}
      </div>
    </div>
  )
}

export default ChatList