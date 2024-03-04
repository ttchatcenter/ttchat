import useGetFacebookComment from "@/hooks/chat/useGetFacebookComment";
import dayjs from "dayjs"
import "dayjs/locale/th";
import relativeTime from 'dayjs/plugin/relativeTime'
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(relativeTime)
dayjs.extend(buddhistEra); 
dayjs.locale("th");

const FacebookSection = (props) => {
  const { data } = props

  const {
    post,
    pageProfile,
    platform,
  } = useGetFacebookComment(data)

  return (
    <>
      <div className="typo-shl1 text-accent-grey">Post</div>
      <div className="flex gap-[10px] w-full">
        <img
          src={pageProfile}
          className="w-12 h-12 object-cover rounded-full shadow-[0px_1px_4px_0px_#00000040]"
        />
        <div className="flex flex-col gap-2 typo-th-c3 text-main-grey4 flex-1 ">
          <div className="flex justify-between">
            <div className="typo-th-b2 text-accent-body-text font-semibold">{platform?.name}</div>
          </div>
          <div className="text-accent-grey">โพสต์เมื่อ {dayjs(post?.data?.created_time).fromNow()}</div>
          <a
            href={post?.post_url}
            target="_blank"
            className="underline cursor-pointer"
          >
            ดูโพสต์ต้นฉบับ
          </a>
        </div>
      </div>
      {
        post?.data?.full_picture ? (
          <div className="flex justify-center gap-3">
            <img
              className="w-full h-full object-cover"
              src={post?.data?.full_picture}
            />
          </div>
        ) : undefined
      }
      <div className="typo-th-c3 text-accent-grey">
        {post?.data?.message}
      </div>
      <div className="w-full border-b border-main-grey2" />
    </>
  )
}

export default FacebookSection