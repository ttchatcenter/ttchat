import { Table, Modal } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useDeleteQuickReply from '@/hooks/quickReply/useDeleteQuickReply';

const List = (props) => {
  const { deleteQuickReply } = useDeleteQuickReply({
    onSuccess: () => {
      props.refetch()
    }
  })
  const handleDelete = (record) => (e) => {
    e.stopPropagation()
    Modal.confirm({
      title: `ยืนยันการลบข้อความ ${record.title}`,
      onOk: async () => {
        deleteQuickReply(record.id)
      },
      okButtonProps: { className: '!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red' },
      cancelButtonProps: { className: 'hover:!border-main-orange hover:!text-main-orange' }
    })
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Image',
      dataIndex: 'quick_reply_image',
      key: 'quick_reply_image',
      render: (image) => {
        if (!image.length) return '-'
        return (
          <div className='flex gap-1'>
            {
              image.map(i => (
                <img key={i.id} src={i.image} className='w-[40px]' />
              ))
            }
          </div>
        )
      }
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (message) => <span className='whitespace-pre-wrap'>{message}</span>

    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => {
        return (
          <div className='flex gap-1 w-full justify-end'>
            {/* <EditOutlined /> */}
            <DeleteOutlined
              onClick={handleDelete(record)}
              className='cursor-pointer'
            />
          </div>
        )
      }
    }
  ];


  const onRow = (record) => ({
    onClick: () => {
      Modal.confirm({
        title: `ยืนยันการส่งส่งข้อความ ${record.title}`,
        onOk: async () => {
          props.onSelectMessage(record)
        },
        okButtonProps: { className: '!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red' }
      })
    },
  })

  return (
    <Table
      columns={columns}
      dataSource={props.data}
      onRow={onRow}
      pagination={{
        pageSize: 5,
      }}
    />
  )
}

export default List