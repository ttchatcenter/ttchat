import { useState } from 'react'
import useUser from "@/hooks/common/useUser"
import AssignModal from "./assignModal"
import { firstLetterUpperCase } from '@/utils'
import {
  UserAddOutlined,
  MessageOutlined,
} from "@ant-design/icons"

const AssignSection = (props) => {
  const { data } = props
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  
  if (!['super_admin',  'supervisor'].includes(user?.role)) {
    return null
  }

  if (data?.assignee) {
    return (
      <div className="flex items-center gap-2 text-accent-grey">
        <span>Assign to: </span>
        <div
          className="w-6 h-6 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
        >
          <img
            className="w-6 h-6 rounded-full object-cover"
            src={data?.assigned?.profile_pic}
          />
        </div>
        <span>{`${firstLetterUpperCase(data?.assigned?.firstname)} ${firstLetterUpperCase(data?.assigned?.lastname)}`}</span>
        <AssignModal
          open={open}
          data={data}
          handleSuccess={() => setOpen(false)}
          handleCancel={() => setOpen(false)}
        />
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2 text-accent-grey">
        <span>Assign to: </span>
        <div className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full bg-main-white border border-main-orange">
          <UserAddOutlined className="!text-main-orange"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
          />
        </div>
        <AssignModal
          open={open}
          data={data}
          handleSuccess={() => setOpen(false)}
          handleCancel={() => setOpen(false)}
        />
      </div>
    )
  }
}

export default AssignSection