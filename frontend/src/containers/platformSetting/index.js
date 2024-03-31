import { useState } from "react"
import classNames from "classnames"
import { Input, Table, Modal } from "antd"
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons"
import { firstLetterUpperCase } from "@/utils"
import Tag from "@/components/Tag"
import useDebouncedCallback from "@/utils/useDebounceCallback"
import useListPlatform from "@/hooks/platform/useListPlatform"
import useBrand from "@/hooks/common/useBrand"
import { CreatePlatformFormWithModal } from "./CreatePlatformForm"
import { UpdatePlatformFormWithModal } from "./UpdatePlatformForm"
import useDeletePlatform from "@/hooks/platform/useDeletePlatform"

const PLATFORM = {
  facebook: '/images/fb-icon.png',
  messenger: '/images/messenger-icon.png',
  line: '/images/line-icon.png',
  twitter: '/images/x-icon.png',
  pantip:'pantip-icon.png',
  inbox:'pantip-inbox-icon.png',
  dm: '/images/dm-icon.png',
}

const PlatformSettingPage = () => {
  const [keyword, setKeyword] = useState('')
  const [pagination, setPagination] = useState({})
  const [sorter, setSorter] = useState({})

  const { brand } = useBrand()

  const { platforms, total, refetch } = useListPlatform({
    brand_id: brand?.id || undefined,
    keyword: keyword || undefined,
    page: pagination?.current || 1,
    limit: pagination?.pageSize || 10,
    sort_field: sorter?.field && sorter?.order ? sorter?.field : undefined,
    sort_order: sorter?.field && sorter?.order ? sorter?.order?.replace('end', '') : undefined,
  })

  const { deletePlatform } = useDeletePlatform({
    onSuccess: () => {
      refetch()
    }
  })

  const handleDelete = (record) => (e) => {
    e.stopPropagation()
    Modal.confirm({
      title: `ยืนยันการลบข้อความ ${record.name} (${record.type})`,
      onOk: async () => {
        deletePlatform(record.id)
      },
      okButtonProps: { className: '!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red' },
      cancelButtonProps: { className: 'hover:!border-main-orange hover:!text-main-orange' }
    })
  }

  const debounceSetKeyword = useDebouncedCallback((value) => {
    setKeyword(value)
  }, 500)

  const columns = [
    {
      title: '',
      dataIndex: 'type',
      width: 60,
      align: 'center',
      render: (type) => (
        <img src={PLATFORM[type]} />
      ),
    },
    {
      title: 'Platform',
      dataIndex: 'type',
      sorter: true,
      render: (platform) => firstLetterUpperCase(platform),
    },
    {
      title: 'Channel or name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      render: (status) => (
        <Tag text={status} />
      )
    },
    {
      title: 'Action',
      dataIndex: 'id',
      render: (id, record) => (
        <div className="flex gap-2">
          <UpdatePlatformFormWithModal
            platformId={id}
            onSuccess={() => refetch()}
          />
          {
            record.type === 'facebook' || record.type === 'messenger' ? (
              <div
                className="[&_*]:text-main-orange cursor-pointer typo-b4"
                onClick={handleDelete(record)}
              >
                <DeleteOutlined /> <span>Delete</span>
              </div>
            ) : undefined
          }
        </div>
      )
    },
  ]

  const onChange = (pagination, _, sorter) => {
    setPagination(pagination)
    setSorter(sorter)
  };

  return (
    <div className="h-full w-full py-6 px-4 flex flex-col gap-6">
      <h3 className="typo-hl2 text-accent-body-text">Platform Setting</h3>
      <div className="flex justify-between">
        <Input
          placeholder="Search"
          suffix={<SearchOutlined />}
          onChange={(e) => debounceSetKeyword(e.target.value)}
          className="max-w-[332px] !rounded-full typo-b4 !py-[7px] !px-3"
        />
        <CreatePlatformFormWithModal
          onSuccess={() => refetch()}
        />
      </div>
      <div className={cardClass}>
        <Table
          columns={columns}
          dataSource={platforms}
          onChange={onChange}
          pagination={{
            ...pagination,
            total,
          }}
        />
      </div>
    </div>
  )
}

const cardClass = classNames(
  'bg-main-white border border-main-grey2',
  'py-4 px-3',
  'rounded-2xl',
  'mx-auto',
  'w-full',
  'flex flex-col gap-8'
)

export default PlatformSettingPage