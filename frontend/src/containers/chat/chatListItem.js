import Tag from "@/components/Tag"
import dayjs from "dayjs"
import "dayjs/locale/th";
import relativeTime from 'dayjs/plugin/relativeTime'
import buddhistEra from "dayjs/plugin/buddhistEra";
import AssignSection from "./assignSection";

dayjs.extend(relativeTime)
dayjs.extend(buddhistEra); 
dayjs.locale("th");

const PLATFORM = {
  facebook: '/images/fb-icon.png',
  messenger: '/images/messenger-icon.png',
  line: '/images/line-icon.png',
<<<<<<< HEAD
  pantip:'pantip-icon.png',
  inbox:'pantip-inbox-icon.png',
  twitter: '/images/x-icon.png',
  dm: '/images/dm-icon.png',
=======
  pantip: '/images/pantip-icon.png',
  twitter: '/images/twitter-icon.png',
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
}

const PROFILE = {
  facebook: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg',
  messenger: 'https://images.summitmedia-digital.com/cosmo/images/2020/08/26/julia-barretto-profile-picture-idea-1598430021.jpg',
  line: 'https://i.pinimg.com/474x/98/51/1e/98511ee98a1930b8938e42caf0904d2d.jpg',
<<<<<<< HEAD
  pantip:'pantip-icon.png',
  inbox:'pantip-inbox-icon.png',
  twitter: '/images/x-icon.png',
  dm: '/images/dm-icon.png',
=======
  pantip: '/images/pantip-icon.png',
  twitter: '/images/twitter-icon.png',
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
}

const renderTime = (time) => {
  
   const currentTime = dayjs()
   const chatTime = dayjs(time)
  if (currentTime.isSame(chatTime, 'day')) {
    return chatTime.format('HH:mm')
  } else if (currentTime.isSame(chatTime, 'week')) {
    return chatTime.format('dd')
  } else {
    const DM = chatTime.format('D MMM')
    const Y = (parseInt(chatTime.format('YYYY'), 10) + 543) % 100
    return `${DM} ${Y}`
  }
}

const ChatListItem = (props) => {
  const { type, data, handleClick } = props
  //alert(type)
  return (
    <div
      className="p-4 flex flex-col gap-2 border-b border-main-grey3 hover:bg-accent-orange-bg1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex gap-3 w-full">
        <div className="w-[50px] h-[50px] relative">
          <img
            className="w-full h-full rounded-full object-cover"
            src={
              type === 'pantip' ? PROFILE[type] : (data?.customer_profile || PROFILE[type])
            }
          />
          {
            ['messenger', 'line','inbox', 'dm', 'facebook','pantip','twitter'].includes(type) ? (
              <img
                src={PLATFORM[type]}
                className="absolute bottom-0 right-0 w-5 h-5"
              />
            ) : undefined
          }
        </div>
        {
          ['messenger', 'line','inbox', 'dm'].includes(type) ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center w-full gap-2">
                <div className="typo-th-b2 line-clamp-1 break-all">{data?.customer_name}</div>
                <Tag text={data?.status} customClasses="typo-c3 px-2" />
                <div className="typo-b4 text-main-grey4 ml-auto">{data ? renderTime(data?.latest_message_time) : undefined}</div>
              </div>
              <div className="flex items-center justify-between w-full gap-8">
                <p className="flex-1 line-clamp-1 typo-th-c3 text-accent-grey">
                  {data?.latest_message}
                </p>
                {
                  data?.unread_count ? (
                    <span className="typo-b1 text-main-white bg-main-orange py-[2px] px-[10px] rounded-full">{data?.unread_count}</span>
                  ) : undefined
                }
              </div>
            </div>
          ) : undefined
        }
        {
          type === 'facebook' ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col w-full gap-[4px]">
                <div className="flex items-center gap-2">
                  <span className="typo-th-b2 line-clamp-1 break-all">{data?.customer_name}</span>
                  <Tag text={data?.status} customClasses="typo-c3 px-2" />
                </div>
                {/* condition render time */}
                <span className="typo-th-c3 text-main-grey4">โพสต์เมื่อ {dayjs(data?.latest_message_time).fromNow()}</span>
              </div>
              <div className="flex items-center justify-between w-full gap-8">
                <p className="flex-1 line-clamp-1 typo-th-c3 text-accent-grey">
                  {data?.latest_message}
                </p>
              </div>
            </div>
          ) : undefined
        }
        {
          type === 'pantip' ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col w-full gap-[4px]">
                <div className="flex items-center gap-2 w-full">
                  <span className="flex-1 line-clamp-1 typo-th-b2">สนใจเครื่องกรองน้ำ coway หนีไปหรือคุ้มค่าครับ</span>
                  <Tag text="new" customClasses="typo-c3 px-2" />
                </div>
                <span className="typo-th-c3 text-main-grey4">โพสต์เมื่อ {dayjs(data?.latest_message_time).fromNow()}</span>
              </div>
            </div>
          ) : undefined
        }
        {
          type === 'twitter' ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col w-full gap-[4px]">
                <div className="flex items-center gap-2">
                  <span className="typo-th-b2 line-clamp-1 break-all">{data?.customer_name}</span>
                  <Tag text={data?.status} customClasses="typo-c3 px-2" />
                </div>
                {/* condition render time */}
                <span className="typo-th-c3 text-main-grey4">โพสต์เมื่อ {dayjs(data?.latest_message_time).fromNow()}</span>
              </div>
              <div className="flex items-center justify-between w-full gap-8">
                <p className="flex-1 line-clamp-1 typo-th-c3 text-accent-grey">
                  {data?.latest_message}
                </p>
              </div>
            </div>
          ) : undefined
        }
      </div>
      {/* {
         type === 'facebook' ? (
          <div className="flex justify-end w-full gap-1">
            <MessageOutlined className="!text-main-grey3" />
            <span className="typo-c2 text-main-grey3">1 comment</span>
          </div>
         ) : undefined
      } */}
      <AssignSection data={data} />
    </div>
  )
}

export default ChatListItem