import classNames from "classnames"
import { useState } from "react"
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  BarChartOutlined,
  CommentOutlined,
  FileTextOutlined,
  SettingOutlined,
  UpOutlined,
  DownOutlined,
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
import useBrand from "@/hooks/common/useBrand"

const wrapperClass = classNames(
  'h-full',
  'min-h-screen',
  'w-full',
  'flex',
)

const MenuItem = (props) => {
  const { icon, name, path, submenu } = props
  const [expand, setExpand] = useState(false)
  const { route, push } = useRouter()

  if (!submenu) {
    const isActive = route === path

    return (
      <div
        className={`py-4 px-3 flex gap-[10px] ${isActive ? 'text-main-red' : 'text-main-grey5'} hover:text-main-red cursor-pointer`}
        onClick={() => push(path)}
      >
        {icon}
        <span className={`${isActive ? 'typo-b1' : 'typo-b3'}`}>{name}</span>
      </div>
    )
  }
  return (
    <>
      <div
        className="py-4 px-3 flex items-center gap-[10px] text-main-grey5 cursor-pointer"
        onClick={() => setExpand(!expand)}
      >
        {icon}
        <span className="typo-b3">{name}</span>
        {
          expand ? (
            <UpOutlined className="text-lg ml-auto" />
          ) : (
            <DownOutlined className="text-lg ml-auto" />
          )
        }
      </div>
      {
        expand ? submenu.map(i => {
          const isActive = route === i.path
          return (
            <div
              key={i.name}
              className={`py-4 pl-[46px] flex ${isActive ? 'text-main-red' : 'text-main-grey5'} hover:text-main-red cursor-pointer`}
              onClick={() => push(i.path)}
            >
              <span className={`${isActive ? 'typo-b1' : 'typo-b3'}`}>{i.name}</span>
            </div>
          )
        }) : undefined
      }
    </>
  )
}

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

  const { user, refetch: refetchUser } = useUser({ redirectIfNotFound: '/login' })
  const { brand, refetch: refetchBrand } = useBrand()

  const { logout } = useLogout({
    onSuccess: () => {
      window.localStorage.removeItem(config.userSessionKey)
      window.localStorage.removeItem(config.brandSessionKey)
      refetchUser()
      refetchBrand()
    }
  })
  
  const { updateStatus } = useUpdateStatus({
    onSuccess: () => {
      refetchUser()
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
    'h-[81px]',
    'box-border',
    'px-20',
    'py-6',
    'fixed',
    'top-0',
    'z-30',
    'bg-main-white',
    'shadow-[0px_1px_4px_0px_#00000040]',
    'pl-[308px]'
  )

  const headerMenuClass = classNames(
    'w-full h-full',
    'flex',
    'items-center',
    'gap-4',
  )

  const siderClass = classNames(
    'flex',
    'flex-col',
    'p-5',
    'w-[248px]',
    'bg-main-white',
    'shadow-[0px_4px_4px_0px_#00000040]',
    'h-screen',
    'fixed',
    'top-0',
    'left-0',
    'z-40',
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
      <sidebar className={siderClass}>
        <img className="w-20 my-6 mx-auto" src="/images/logo.png" />
        <div className="w-full h-[1px] bg-[#00000020]" />
        <div className="flex-1 flex flex-col gap-2 pt-6 overflow-scroll no-scrollbar">
          <MenuItem
            icon={<HomeOutlined className="text-2xl"/>}
            name="Home"
            path="/brand-management"
          />
          {
            brand ? (
              <>
                <MenuItem
                  icon={<BarChartOutlined className="text-2xl"/>}
                  name="Dashboard"
                  path="/dashboard"
                />
                <MenuItem
                  icon={<CommentOutlined className="text-2xl"/>}
                  name="Chat"
                  path="/chat"
                />
                {
                  user?.role === 'super_admin' || user?.role === 'supervisor' ? (
                    <MenuItem
                      icon={<FileTextOutlined className="text-2xl"/>}
                      name="Report"
                      submenu={[
                        { name: 'Overall Performance', path: '/report/overall-performance' },
                        { name: 'Agent Performance', path: '/report/agent-performance' },
                      ]}
                    />
                  ) : undefined
                }
                {
                  user?.role === 'super_admin' || user?.role === 'supervisor' ? (
                    <MenuItem
                      icon={<SettingOutlined className="text-2xl"/>}
                      name="Setting"
                      submenu={[
                        { name: 'Member Setting', path: '/setting/member' },
                        { name: 'Brand Setting', path: '/setting/brand' },
                        { name: 'CRM Setting', path: '/setting/crm' },
                        { name: 'Platform Setting', path: '/setting/platform' },
                        // { name: 'Pantip Setting', path: '/setting/tag' },
                        { name: 'Category Setting', path: '/setting/category' },
                      ]}
                    />
                  ) : undefined
                }
              </>
            ) : undefined
          }
        </div>
      </sidebar>
      <div className={`flex flex-col flex-1 ${props.pageBg || 'bg-main-white'}`}>
        <header className={headerClass}>
          <div className={headerMenuClass}>
            {
              brand ? (
                <div className="flex items-center gap-4">
                  <img
                    src={brand?.logo}
                    className="w-8 h-8 rounded-full shadow-[0px_1px_4px_0px_#00000040]"
                  />
                  <span className="typo-hl2 text-main-grey6">{brand?.name}</span>
                </div>
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
        <div className="flex-1 pl-[248px] pt-[81px]">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Layout