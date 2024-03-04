import { useState } from "react";
import { CommentOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import classNames from "classnames";
import useBrand from "@/hooks/common/useBrand";
import Button from "@/components/Button";
import useListQuickReply from "@/hooks/quickReply/useListQuickReply";
import List from "./list";
import Add from "./add";

const QuickReply = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('list')
  const { brand } = useBrand()
  const { list, refetch } = useListQuickReply({
    brand_id: brand?.id
  })
  const handleClose = () => setShowModal(false)

  const handleSelectMessage = async (record) => {
    await props.handleSelectMessage(record)
    handleClose()
  } 

  return (
    <>
      <CommentOutlined
        style={{ color: '#CBD9D1' }}
        className="cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      <Modal
        open={showModal}
        title={type === 'list' ? 'Quick Reply' : (type === 'add' ? 'Add Quick Reply' : 'Edit Quick Reply')}
        onOk={handleClose}
        onCancel={handleClose}
        footer={false}
        width={800}
        centered
        destroyOnClose
        className={classNames(
          '[&_.ant-modal-content]:!px-8',
          '[&_.ant-modal-content]:!py-8',
          '[&_.ant-modal-content]:!rounded-2xl',
        )}
      >
        {
          type === 'list' ? (
            <div className="flex flex-col gap-2">
              <Button
                _type="primary"
                _size="s"
                className="w-fit ml-auto"
                onClick={() => setType('add')}
              >
                Add
              </Button>
              <List
                data={list}
                refetch={refetch}
                handleClose={handleClose}
                onSelectMessage={handleSelectMessage}  
              />
            </div>
          ) : undefined
        }
        {
          type === 'add' ? (
            <Add
              setType={setType}
              refetch={refetch}
              brand={brand}
            />
          ) : undefined
        }
      </Modal>
    </>
  )
}

export default QuickReply