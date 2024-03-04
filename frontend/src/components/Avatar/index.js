import classNames from "classnames"
import Badge from "../Badge"

const statusMapper = {
  available: { color: 'bg-tag-green' },
  idle: { color: 'bg-main-grey5' },
  awc: { color: '!text-main-red bg-main-white', minus: true },
  break: { color: 'bg-main-orange' },
  toilet: { color: 'bg-main-red' },
  meeting: { color: '!text-main-red bg-main-white', minus: true },
  consult: { color: '!text-main-red bg-main-white', minus: true },
  traning: { color: '!text-main-red bg-main-white', minus: true },
  special_assign: { color: '!text-main-red bg-main-white', minus: true },
}

const Avatar = ({ user }) => {
  const status = user?.badge_status

  return (
    <div className={avatarClass}>
      {
        user?.profile_pic ? (
          <img
            src={user?.profile_pic}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <span className="typo-shl1 text-main-white">
            {user?.username?.split('')?.[0]?.toUpperCase()}
          </span>
        )
      }
      <Badge {...statusMapper[status || 'available']} customClasses={badgeClass} />
    </div>
  )
}

const avatarClass = classNames(
  'w-12 h-12',
  'flex items-center justify-center',
  'relative',
  'rounded-full',
  'bg-main-grey4',
)

const badgeClass = classNames(
  'absolute bottom-0 right-0',
  'border-2 border-main-white',
  'w-[17px] h-[17px]',
  'rounded-full',
)

export default Avatar