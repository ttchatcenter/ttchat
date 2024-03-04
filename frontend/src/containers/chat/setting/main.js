import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'throttle-debounce'
import dayjs from 'dayjs'
import {
  CopyOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  PlusCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { Input } from 'antd'
import Tag from '@/components/Tag'
import Button from "@/components/Button"
import FacebookSection from './facebookSection'
import { firstLetterUpperCase } from '@/utils'
import useUpdateNote from '@/hooks/chat/useUpdateNote'
import useGetActivities from '@/hooks/chat/useGetActivities'
import useGetTags from '@/hooks/chat/useGetTags'
import TagModal from './tagModal'

const Collapse = ({ trigger, children }) => {
  const [expand, setExpand] = useState(true)
  return (
    <>
      <div
        className="flex items-center gap-2 text-accent-grey cursor-pointer"
        onClick={() => setExpand(!expand)}
      >
        {
          expand ? (
            <CaretDownOutlined />
          ) : (
            <CaretRightOutlined />
          )
        }
        {trigger}
      </div>
      {
        expand ? children : undefined
      }
    </>
  )
}

const Main = (props) => {
  const { data, pantip, facebook, setState } = props

  const [text, setText] = useState('')
  const [showTagModal, setShowTagModal] = useState(false)
  const { activities } = useGetActivities(data?.id)
  const { brand_tags, chat_tags, refetch } = useGetTags(data?.id)
  const { updateNote } = useUpdateNote()

  const debounceUpdateNote = useCallback(debounce(1000, (...text) => updateNote(...text)), []);

  useEffect(() => {
    setText(data?.note)
  }, [data?.note])

  const isOpen = data?.status !== 'closed' && data?.status !== 'rejected'

  return (
    <>
      <div className={`${pantip ? (isOpen ? 'h-[calc(100vh-81px-162px-87px)]' : 'h-[calc(100vh-81px-87px)]') : (isOpen ? 'h-[calc(100vh-81px-162px-0px)]' : 'h-[calc(100vh-81px-0px)]')} overflow-y-scroll flex flex-col p-4 gap-4 w-full`}>
        {
          facebook ? (
            <FacebookSection data={data} />
          ) : undefined
        }
        {
          pantip ? (
            <>
              <div className="typo-shl1 text-accent-grey">Keyword</div>
              <div className="flex flex-wrap gap-[10px]">
                {
                  ['Coway', 'เครื่องกรองน้ำ coway', 'อุปกรณ์เครื่องใช้ภายในบ้าน'].map(i => (
                    <div key={i} className="text-accent-grey typo-th-shl3 py-1 px-3 border border-accent-grey rounded-sm">
                      {i}
                    </div>
                  ))
                }
              </div>
              <div className="w-full border-b border-main-grey2" />
            </>
          ) : undefined
        }
        <div className="typo-shl1 text-accent-grey">About</div>
        {
          !pantip && !facebook ? (
            <div className="flex items-center gap-3 typo-th-b2 font-semibold text-main-orange">
              <span>Chat ID: {data?.id || '0000000'}</span>
              <CopyOutlined className="cursor-pointer" onClick={() => {
                  navigator.clipboard.writeText(data?.id || '0000000');
              }} />
            </div>
          ) : undefined
        }
        <div className="w-full border-b border-main-grey2" />
        <Collapse
          trigger={
            <div className="flex-1 typo-th-shl3 text-accent-grey font-semibold">Customer Info</div>
          }
        >
          <div className="flex flex-col gap-2 typo-th-c3 text-accent-grey">
            <div>{`Name: ${data?.customer_name || 'Sam Smith'}`}</div>
            <div>{`ID: ${data?.customer_id || 'Samsam'}`}</div>
          </div>
        </Collapse>
        <div className="w-full border-b border-main-grey2" />
        <Collapse
          trigger={
            <div className="flex-1 flex justify-between typo-th-shl3 text-accent-grey font-semibold">
              <span>Tags</span>
              <div
                className="flex gap-2 text-main-orange"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTagModal(true);
                }}
              >
                <PlusCircleOutlined />
                <span className="underline font-normal">Add Tags</span>
              </div>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            {
              chat_tags?.map(i => (
                <Tag key={i.id} text={i.name} color='yellow' customClasses="typo-th-c3 !px-2 py-[2px]" />
              ))
            }
          </div>
          <TagModal
            chatId={data?.id}
            open={showTagModal}
            handleSuccess={() => {
              refetch()
              setShowTagModal(false)
            }}
            chatTags={chat_tags}
            brandTags={brand_tags}
            handleCancel={() => setShowTagModal(false)}
          />
        </Collapse>
        <div className="w-full border-b border-main-grey2" />
        <Collapse
          trigger={
            <div className="flex-1 flex typo-th-shl3 text-accent-grey font-semibold">
              <span>Notes</span>
            </div>
          }
        >
          <div className="flex">
            <Input.TextArea
              rows={4}
              value={text}
              onChange={e => {
                setText(e.target.value)
                debounceUpdateNote(data?.id, e.target.value)
              }}
            />
          </div>
        </Collapse>
        <div className="w-full border-b border-main-grey2" />
        <div className="flex typo-th-shl3 text-accent-grey font-semibold">
          <span>Activities</span>
        </div>
        <div className='flex flex-col px-6'>
          {
            activities?.map((act, index, arr) => {
              let action = act?.action
              if (action === 'assigned' && [...arr].reverse().find(i => i.action === 'assigned')?.id !== act.id) {
                action = 'transfered'
              }
              return (
                <div key={act.id} className='grid grid-cols-[8px_1fr] gap-3 text-accent-grey typo-th-d1'>
                  <div className='relative'>
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-main-orange' : 'bg-accent-grey'} mt-[7px]`} />
                    {
                      index !== arr.length - 1 ? (
                        <div className={`absolute h-[calc(100%-22px)] w-[1px] ${index === 0 ? 'bg-main-orange' : 'bg-accent-grey'} top-0 mt-[22px] left-2/4 translate-x-[-50%]`}></div>
                      ) : undefined
                    }
                  </div>
                  <div className='flex flex-col gap-1 pb-4'>
                    <div className={`typo-th-b2 font-medium ${index === 0 ? 'text-main-orange' : 'text-accent-grey'}`}>{firstLetterUpperCase(action || '')}</div>
                    <div className='flex gap-2 items-center'>
                      <UserOutlined />
                      <span>{`${firstLetterUpperCase(action || '')} by ${act?.by_system ? 'System' : (act?.name || act?.actor || '-')}`}</span>
                    </div>
                    {
                      act?.to ? (
                        <div className='flex gap-2 items-center'>
                          <UserOutlined />
                          <span>{`${firstLetterUpperCase(action || '')} to ${act?.to_name || act?.to || '-'}`}</span>
                        </div>
                      ) : undefined
                    }
                    <div className='flex gap-2 items-center'>
                      <CalendarOutlined />
                      <span className='pr-6'>{dayjs(act?.created_at).format('DD MMM YYYY')}</span>
                      <ClockCircleOutlined />
                      <span>{dayjs(act?.created_at).format('HH:mm')}</span>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      {
        isOpen ? (
          <div className="flex flex-col gap-[10px] px-4 py-8">
            <Button
              _type="primary"
              className="typo-th-shl3"
              onClick={() => setState('close')}
            >
              Close
            </Button>
            <Button
              _type="secondary"
              className="typo-th-shl3"
              onClick={() => setState('reject')}
            >
              Reject
            </Button>
          </div>
        ) : undefined
      }
    </>
  )
}

export default Main