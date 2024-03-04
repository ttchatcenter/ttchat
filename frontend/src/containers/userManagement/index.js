import { useState } from "react"
import { Input, Table } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import Tag from "@/components/Tag"
import useListUser from "@/hooks/user/useListUsers"
import useDebouncedCallback from "@/utils/useDebounceCallback"
import { firstLetterUpperCase } from "@/utils"
import { CreateUserFormWithModal } from "./CreateUserForm"
import { UpdateUserFormWithModal } from "./UpdateUserForm"

const UserManagement = () => {
  const [keyword, setKeyword] = useState('')
  const [pagination, setPagination] = useState({})
  const [sorter, setSorter] = useState({})

  const { users, refetch, total } = useListUser({
    keyword: keyword || undefined,
    page: pagination?.current || 1,
    limit: pagination?.pageSize || 10,
    sort_field: sorter?.field && sorter?.order ? sorter?.field : undefined,
    sort_order: sorter?.field && sorter?.order ? sorter?.order?.replace('end', '') : undefined,
  })

  const debounceSetKeyword = useDebouncedCallback((value) => {
    setKeyword(value)
    setPagination({
      ...pagination,
      current: 1
    })
  }, 500)

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employee_id',
      sorter: true,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: true,
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Brand ที่ดูแล',
      dataIndex: 'brands_count',
      sorter: true,
      render: (value) => value || 0 
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: true,
      render: (role) => role ? role?.split('_')?.map(firstLetterUpperCase)?.join('') : '-'
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
        <UpdateUserFormWithModal
          userId={id}
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
    <div className="h-full w-full py-14">
      <div className="w-full max-w-[1144px] m-auto flex flex-col gap-8">
        <span className="typo-hl1 text-accent-grey">User management</span>
        <div className="flex justify-between">
          <Input
            placeholder="Search"
            suffix={<SearchOutlined />}
            onChange={(e) => debounceSetKeyword(e.target.value)}
            className="max-w-[332px] !rounded-full"
          />
          <CreateUserFormWithModal
            onSuccess={() => refetch()}
          />
        </div>
        <Table
          columns={columns}
          dataSource={users}
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

export default UserManagement