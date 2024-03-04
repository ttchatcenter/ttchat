import classNames from "classnames"
import { EditOutlined } from "@ant-design/icons"
import useUser from "@/hooks/common/useUser"
import useUpdateUserProfile from "@/hooks/user/useUpdateUserProfile"

const Avatar = () => {
  const { user, refetch } = useUser()

  const { updateUserProfile } = useUpdateUserProfile({
    onSuccess: () => {
      refetch()
      document.getElementById('upload').value = ''
    },
  })

  const handleClickEdit = () => {
    document.getElementById('upload').click()
  }

  const handleFileChange = (e) => {
    updateUserProfile(user?.id, { profile: e.target.files?.[0] })
  }

  return (
    <div className={avatarClass}>
      {
        user?.profile_pic ? (
          <img
            src={user?.profile_pic}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="typo-hd1 text-main-white">
            {user?.username?.split('')?.[0]?.toUpperCase()}
          </span>
        )
      }
      <div className={avatarHoverClass}>
        <EditOutlined
          className="!text-main-white mb-[10px] text-2xl cursor-pointer"
          onClick={handleClickEdit}
        />
      </div>
      <input
        type="file"
        id="upload"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

const avatarClass = classNames(
  'group',
  'w-[100px] h-[100px]',
  'relative',
  'flex items-center justify-center',
  'rounded-full',
  'bg-main-grey4',
  'mx-auto mb-10',
  'overflow-hidden',
)

const avatarHoverClass = classNames(
  'hidden group-hover:flex',
  'items-end justify-center',
  'w-[100px] h-[100px]',
  'absolute inset-0',
  'bg-[rgba(0,_0,_0,_50%)]',
  'rounded-full',
)

export default Avatar