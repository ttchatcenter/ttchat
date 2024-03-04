import { useState } from "react"
import classNames from "classnames"
import { Input, Table } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import Tag from "@/components/Tag"
import useDebouncedCallback from "@/utils/useDebounceCallback"
import useListTag from "@/hooks/pantipTag/useListTag"
import useBrand from "@/hooks/common/useBrand"
import { CreateTagFormWithModal } from "./CreateTagForm"
import { UpdateTagFormWithModal } from "./UpdateTagForm"


const TagSettingPage = () => {
  const [keyword, setKeyword] = useState('')
  const [pagination, setPagination] = useState({})
  const [sorter, setSorter] = useState({})

  const { brand } = useBrand()

  const { tags, total, refetch } = useListTag({
    brand_id: brand?.id || undefined,
    keyword: keyword || undefined,
    page: pagination?.current || 1,
    limit: pagination?.pageSize || 10,
    sort_field: sorter?.field && sorter?.order ? sorter?.field : undefined,
    sort_order: sorter?.field && sorter?.order ? sorter?.order?.replace('end', '') : undefined,
  })

  const debounceSetKeyword = useDebouncedCallback((value) => {
    setKeyword(value)
  }, 500)

  const columns = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      sorter: true,
    },
    {
      title: 'Date Added',
      dataIndex: 'created_at',
      sorter: true,
      render: (date) => dayjs(date).format('YYYY/MM/DD')
    },
    {
      title: 'Added By',
      dataIndex: 'created_user',
      render: (user) => `${user?.firstname} ${user?.lastname}`
    },
    {
      title: 'Last Edited Date',
      dataIndex: 'updated_at',
      sorter: true,
      render: (date) => date ? dayjs(date).format('YYYY/MM/DD') : '-'
    },
    {
      title: 'Edited By',
      dataIndex: 'updated_user',
      render: (user) => user ? `${user?.firstname} ${user?.lastname}` : '-'
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
      render: (id) => (
        <UpdateTagFormWithModal
          tagId={id}
          onSuccess={() => refetch()}
        />
      )
    },
  ]

  const onChange = (pagination, _, sorter) => {
    setPagination(pagination)
    setSorter(sorter)
  };

  return (
    <div className="h-full w-full py-6 px-4 flex flex-col gap-6">
      <h3 className="typo-hl2 text-accent-body-text">Pantip Setting</h3>
      <div className="flex justify-between">
        <Input
          placeholder="Search Keyword"
          suffix={<SearchOutlined />}
          onChange={(e) => debounceSetKeyword(e.target.value)}
          className="max-w-[332px] !rounded-full typo-b4 !py-[7px] !px-3"
        />
        <CreateTagFormWithModal
          onSuccess={() => refetch()}
        />
      </div>
      <div className={cardClass}>
        <Table
          columns={columns}
          dataSource={tags}
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

export default TagSettingPage