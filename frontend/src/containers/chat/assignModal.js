import { useState } from 'react'
import useGetAssignee from '@/hooks/chat/useGetAssignee'
import useAssign from '@/hooks/chat/useAssign'
import useBrand from '@/hooks/common/useBrand'
import classNames from 'classnames'
import Badge from '@/components/Badge'
import { Modal, Input, Table } from 'antd'
import Button from '@/components/Button'
import {
  SearchOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import { firstLetterUpperCase } from '@/utils'

const STATUS = {
  available: { icon: <Badge color="bg-tag-green" />, label: 'Available' },
  awc: { icon: <Badge color="!text-main-red" minus />, label: 'AWC' },
  break: { icon: <Badge color="bg-main-orange" />, label: 'Break' },
  toilet: { icon: <Badge color="bg-main-red" />, label: 'Toilet' },
  meeting: { icon: <Badge color="!text-main-red" minus />, label: 'Meeting' },
  consult: { icon: <Badge color="!text-main-red" minus />, label: 'Consult' },
  training: { icon: <Badge color="!text-main-red" minus />, label: 'Training' },
  special_assign: { icon: <Badge color="!text-main-red" minus />, label: 'Special Assign' },
  idle: { icon: <Badge color="!bg-accent-grey" />, label: 'Idle' },
}

const AssignModal = (props) => {
  const { open, handleSuccess, handleCancel, data } = props
  const [keyword, setKeyword] = useState('')
  const [showConfirm, setShowConfirm] = useState(null)
  const { brand } = useBrand()
  const { list } = useGetAssignee(brand?.id, data?.source, open)
  const { assign } = useAssign({
    onSuccess: () => setShowConfirm(null)
  })

  const filteredList = list?.filter((v) => {
      if (!keyword) return true
      return v?.user?.firstname?.toLowerCase()?.includes(keyword.toLowerCase()) ||
        v?.user?.lastname?.toLowerCase()?.includes(keyword.toLowerCase())
    })

  const columns = [
    {
      title: 'Agent name',
      dataIndex: 'id',
      render: (_, record) => `${firstLetterUpperCase(record?.user?.firstname)} ${firstLetterUpperCase(record?.user?.lastname)}`
    },
    {
      title: 'Role',
      dataIndex: 'id',
      render: (_, record) => record?.user?.role?.split('_').map(firstLetterUpperCase).join(' ')
    },
    {
      title: 'Handling',
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => {
        if (record?.platform_1 === data?.source) {
          return record?.current_ticket_1
        } else if (record?.platform_2 === data?.source) {
          return record?.current_ticket_2
        } else if (record?.platform_3 === data?.source) {
          return record?.current_ticket_3
        } else if (record?.platform_4 === data?.source) {
          return record?.current_ticket_4
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'id',
      render: (_, record) => {
        const stat = STATUS[record?.user?.badge_status || 'idle']
        return (
          <div className='flex gap-2 items-center'>
            {stat.icon}
            {stat.label}
          </div>
        )
      }
    },
    {
      title: 'Available concurrent',
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => {
        if (record?.platform_1 === data?.source) {
          return record?.concurrent_1 - record?.current_ticket_1
        } else if (record?.platform_2 === data?.source) {
          return record?.concurrent_2 - record?.current_ticket_2
        } else if (record?.platform_3 === data?.source) {
          return record?.concurrent_3 - record?.current_ticket_3
        } else if (record?.platform_4 === data?.source) {
          return record?.concurrent_4 - record?.current_ticket_4
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'id',
      render: (id, record) => {
        const isAssignee = record?.user?.id === data?.assignee
        return (
          <div
            className={`flex gap-1 ${isAssignee ? 'text-accent-grey' : 'text-main-orange cursor-pointer'}`}
            // onClick={() => isAssignee ? undefined : assign(data.id, id)}
            onClick={() => {
              if (!isAssignee) {
                setShowConfirm(record)
                handleCancel()
              }
            }}
          >
            <UserAddOutlined />
            Assign
          </div>
        )
      }
    },
  ]

  return (
    <>
        <Modal
          open={open}
          title="Assign Chat to Agent"
          onOk={handleSuccess}
          onCancel={handleCancel}
          footer={false}
          width={1000}
          centered
          className={classNames(
            '[&_.ant-modal-header]:!mb-8',
            '[&_.ant-modal-content]:!px-8',
            '[&_.ant-modal-content]:!py-8',
            '[&_.ant-modal-content]:!rounded-2xl',
            '[&_.ant-modal-content]:min-h-[600px]'
          )}
        >
          <Input
            placeholder="Search"
            suffix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-[332px] !rounded-full typo-b4 !py-[7px] !px-3 mb-4"
          />
          <Table
            columns={columns}
            dataSource={filteredList}
            pagination={{
              pageSize: 5,
            }}
          />
        </Modal>
        <Modal
          open={showConfirm}
          title="Assignment Confirmation"
          onOk={() => assign(data.id, showConfirm.id)}
          onCancel={() => setShowConfirm(null)}
          centered
          footer={false}
          className={classNames(
            '[&_.ant-modal-header]:!mb-8',
            '[&_.ant-modal-content]:!px-8',
            '[&_.ant-modal-content]:!py-8',
            '[&_.ant-modal-content]:!rounded-2xl',
          )}
        >
          <div className='flex flex-col mb-8 typo-th-b2'>
            <div>Assign to: <span className='font-semibold'>{`${firstLetterUpperCase(showConfirm?.user?.firstname)} ${firstLetterUpperCase(showConfirm?.user?.lastname)}`}</span></div>
            <div>กรุณาตรวจสอบข้อมูลการ assign ก่อนทำการยืนยัน</div>
          </div>
          <div className='flex justify-center gap-4'>
            <Button
              _type="secondary"
              className='w-[100px]'
              onClick={() => setShowConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              _type="primary"
              className='w-[100px]'
              onClick={() => assign(data.id, showConfirm.id)}
            >
              Confirm
            </Button>
          </div>
        </Modal>
    </>
  )
}

export default AssignModal