import { useState, useEffect, useCallback } from "react"
import classNames from "classnames"
import { Modal, Form, Input } from "antd"
import Button from "@/components/Button"
import useCreateTags from "@/hooks/chat/useCreateTags"
import Tag from '@/components/Tag'

const TagModal = (props) => {
  const [form] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true)

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => !formData[k])
    const duplicate = props.chatTags?.find(i => i.name === formData.name)
    setDisabledSave(notFilled || duplicate);
  }

  useEffect(() => {
    handleFormChange()
  }, [props.open])

  const { createTags } = useCreateTags({
    onSuccess: () => {
      form.resetFields()
      props.handleSuccess()
    },
  })

  const handleFinish = (value) => {
    createTags(props.chatId, value.name)
  }

  return (
    <Modal
      open={props.open}
      title="Add New Tag"
      onOk={props.handleSuccess}
      onCancel={props.handleCancel}
      footer={false}
      width={595}
      centered
      className={classNames(
        '[&_.ant-modal-header]:!mb-8',
        '[&_.ant-modal-content]:!px-8',
        '[&_.ant-modal-content]:!py-8',
        '[&_.ant-modal-content]:!rounded-2xl',
      )}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className='w-full w-full'
        form={form}
        onFinish={handleFinish}
        onFieldsChange={handleFormChange}
        requiredMark={false}
      >
        <Form.Item
          label="Tag"
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="flex flex-col gap-4 w-full">
            <div className="w-fill border-b border-accent-grey"></div>
            <div className="flex gap-2">
              {
                props.brandTags?.filter(i => !props?.chatTags?.find(j => j.name === i.name))?.map(i =>(
                  <Tag
                    key={i.id}
                    text={i.name}
                    color='yellow'
                    customClasses="typo-th-c3 !px-2 py-[2px] cursor-pointer"
                    onClick={() => {
                      form.setFieldValue('name', i.name)
                      setTimeout(handleFormChange, 300)
                    }}
                  />
                ))
              }
            </div>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} className="!mb-0">
          <div className='flex justify-center gap-4'>
            <Button
              _type="secondary"
              className='w-[100px]'
              onClick={() => {
                form.resetFields()
                props.handleCancel()
              }}
            >
              Cancel
            </Button>
            <Button
              _type="primary"
              className='w-[100px]'
              htmlType="submit"
              disabled={disabledSave}
            >
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TagModal