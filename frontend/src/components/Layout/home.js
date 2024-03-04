import classNames from "classnames"
import {
  ApartmentOutlined,
  UserSwitchOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons"
import { useRouter } from "next/router"
import Avatar from "@/components/Avatar"
import { Tooltip } from "antd"
import config from '@/configs'
import useUser from "@/hooks/common/useUser"
import useLogout from "@/hooks/auth/useLogout"
import useUpdateStatus from "@/hooks/user/useUpdateStatus"
import Badge from "../Badge"
import { firstLetterUpperCase } from "@/utils"

const wrapperClass = classNames(
  'h-full',
  'min-h-screen',
  'w-full',
  'flex',
)

const STATUS = {
  available: 'Available',
  awc: 'AWC',
  break: 'Break',
  toilet: 'Toilet',
  meeting: 'Meeting',
  consult: 'Consult',
  training: 'Training',
  special_assign: 'Special Assign',
}

const Layout = (props) => {
  const { route, push } = useRouter()

  const { user, refetch } = useUser({ redirectIfNotFound: '/login' })
  const { logout } = useLogout({
    onSuccess: () => {
      window.localStorage.removeItem(config.userSessionKey)
      window.localStorage.removeItem(config.brandSessionKey)
      refetch()
    }
  })
  
  const { updateStatus } = useUpdateStatus({
    onSuccess: () => {
      refetch()
    }
  })

  const handleClickStatus = (value) => {
    updateStatus(value)
  }

  const Status = ({ icon, label, value }) => {
    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => handleClickStatus(value)}
      >
        {icon}
        <span>{label}</span>
      </div>
    )
  }

  const headerClass = classNames(
    'w-full',
    'h-[120px]',
    'box-border',
    'px-20',
    'py-6',
    'fixed',
    'top-0',
    'z-30',
    'bg-main-white',
    'shadow-[0px_1px_4px_0px_#00000040]',
  )

  const headerMenuClass = classNames(
    'w-full h-full',
    'flex',
    'items-center',
    'justify-center',
    'gap-4',
  )

  const title = (
    <div className="flex flex-col gap-3 p-4 pb-6">
      <div className="typo-b2 text-accent-body-text">Status</div>
      <div className="flex flex-col gap-2 typo-c3 text-accent-grey">
        { Status({ icon: <Badge color="bg-tag-green" />, label: 'Available', value: 'available' }) }
        { Status({ icon: <Badge color="!text-main-red" minus />, label: 'AWC', value: 'awc' }) }
        { Status({ icon: <Badge color="bg-main-orange" />, label: 'Break', value: 'break' }) }
        { Status({ icon: <Badge color="bg-main-red" />, label: 'Toilet', value: 'toilet' }) }
      </div>
      <div className="w-[175px] h-[1px] bg-accent-grey"></div>
      <div className="flex flex-col gap-2 typo-c3 text-accent-grey">
        { Status({ icon: <Badge color="!text-main-red" minus />, label: 'Meeting', value: 'meeting' }) }
        { Status({ icon: <Badge color="!text-main-red" minus />, label: 'Consult', value: 'consult' }) }
        { Status({ icon: <Badge color="!text-main-red" minus />, label: 'Training', value: 'training' }) }
        { Status({ icon: <Badge color="!text-main-red" minus />, label: 'Special Assign', value: 'special_assign' }) }
      </div>
      <div className="w-[175px] h-[1px] bg-accent-grey"></div>
      <div
        className="flex items-center typo-b4 text-main-grey5 gap-2 cursor-pointer"
        onClick={() => push('/my-account')}
      >
        <UserOutlined />
        <span>My Account</span>
      </div>
      <div
        className="flex items-center typo-b4 text-main-grey5 gap-2 cursor-pointer"
        onClick={() => logout()}
      >
        <LogoutOutlined />
        <span>Sign out</span>
      </div>
    </div>
  )

  return (
    <div className={wrapperClass}>
      <div className={`flex flex-col flex-1 ${props.pageBg || 'bg-main-white'}`}>
        <header className={headerClass}>
          <div className={headerMenuClass}>
            {
              user?.role === 'super_admin' ? (
                <>
                  <div
                    className={`flex flex-col items-center w-[205px] ${route === '/brand-management' ? 'text-main-orange' : 'text-[#666666] cursor-pointer'}`}
                    onClick={() => push('/brand-management')}
                  >
                    <ApartmentOutlined className="text-3xl" />
                    <span className="typo-b2">Brand Management</span>
                  </div>
                  <div
                    className={`flex flex-col items-center w-[205px] ${route === '/user-management' ? 'text-main-orange' : 'text-[#666666] cursor-pointer'}`}
                    onClick={() => push('/user-management')}
                  >
                    <UserSwitchOutlined className="text-3xl" />
                    <span className="typo-b2">User Management</span>
                  </div>
                </>
              ) : undefined
            }
            <div className="flex items-center gap-3 absolute right-20">
              <Avatar user={user} />
              <Tooltip placement="bottom" title={title} color="#FFFFFF" arrow={false}>
                <div className="flex gap-3 items-baseline cursor-pointer">
                  <div>
                    <div className="typo-shl1 text-accent-body-text max-w-[180px] truncate">{`${firstLetterUpperCase(user?.firstname)} ${firstLetterUpperCase(user?.lastname)}`}</div>
                    <div className="typo-d1 text-accent-grey">{`ID: ${user?.employee_id}`}</div>
                    <div className="typo-d1 text-main-grey6">{STATUS[user?.badge_status]}</div>
                  </div>
                  <DownOutlined style={{ height: 28 }} />
                </div>
              </Tooltip>
            </div>
          </div>
        </header>
        <div className="flex-1 pt-[120px]">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Layout