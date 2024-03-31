import { useState } from "react"
import classNames from "classnames"
import { Input, Table } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { firstLetterUpperCase } from "@/utils"
import Tag from "@/components/Tag"
import useBrand from "@/hooks/common/useBrand"
import useDebouncedCallback from "@/utils/useDebounceCallback"
import useListBrandMember from "@/hooks/brandMember/useListBrandMember"
import { CreateMemberFormWithModal } from "./CreateMemberForm"
import { UpdateMemberFormWithModal } from "./UpdateMemberForm"

const PLATFORM = {
  facebook: 'Facebook',
  messenger: 'Messenger',
  line: 'Line OA',
  pantip: 'Pantip',
  inbox: 'Pantip Inbox',
  twitter: 'Twitter',
  dm: 'Twitter Dm',
  none: 'None',
}

const MemberSettingPage = () => {
  const [keyword, setKeyword] = useState('')
  const [pagination, setPagination] = useState({})
  const [sorter, setSorter] = useState({})

  const { brand } = useBrand()

  const { members, total, refetch } = useListBrandMember({
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
      title: 'Username',
      dataIndex: 'username',
      sorter: true,
      render: (username) => username,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      render: (email) => email,
    },
    {
      title: 'User\'s Status',
      dataIndex: 'user_status',
      render: (status) => (
        <Tag text={status} />
      )
    },
    {
      title: 'Display name',
      dataIndex: 'display_name',
      sorter: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: true,
      render: (role) => role ? role.split('_').map(firstLetterUpperCase).join('') : '-'
    },
    {
      title: 'Brand Member\'s Status',
      dataIndex: 'status',
      sorter: true,
      render: (status) => (
        <Tag text={status} />
      )
    },
    {
      title: 'Channel',
      dataIndex: 'id',
      render: (_, record) => {
        const list = [];
        ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter' ,'dm'].forEach((v, i) => {
          if (record[`concurrent_${i + 1}`]) {
            list.push(record[`platform_${i + 1}`])
          }
        })
        const channel = list.map(i => PLATFORM[i]).join(', ')
        return channel
      }
    },
    {
      title: 'Response Chat Limit',
      dataIndex: 'id',
      render: (_, record) => {
        const limit = [
          record?.concurrent_1,
          record?.concurrent_2,
          record?.concurrent_3,
          record?.concurrent_4,
          record?.concurrent_5,
        ].reduce((acc, cur) => acc + cur, 0)
        return limit
      }
    },
    {
      title: 'Action',
      dataIndex: 'id',
      render: (id) => (
        <UpdateMemberFormWithModal
          memberId={id}
          onSuccess={() => refetch()}
        />
      )
    },
  ]

  const onChange = (pagination, _, sorter) => {
    setPagination(pagination)
    setSorter(sorter)
  };

  const handleSuccess = async (data) => {
    await refetch()
    // setTimeout(() => {
    //   document.getElementById(`edit-member-${data?.id}`)?.click()
    // }, 300)
  }

  return (
    <div className="h-full w-full py-6 px-4 flex flex-col gap-6">
      <h3 className="typo-hl2 text-accent-body-text">Member Setting</h3>
      <div className="flex justify-between">
        <Input
          placeholder="Search"
          suffix={<SearchOutlined />}
          onChange={(e) => debounceSetKeyword(e.target.value)}
          className="max-w-[332px] !rounded-full typo-b4 !py-[7px] !px-3"
        />
        <CreateMemberFormWithModal
          onSuccess={handleSuccess}
        />
      </div>
      <div className={cardClass}>
        <Table
          columns={columns}
          dataSource={members}
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

export default MemberSettingPage