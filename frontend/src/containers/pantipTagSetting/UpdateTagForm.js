import { useState, useEffect } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Radio } from "antd"
import { EditOutlined } from '@ant-design/icons'
import Button from "@/components/Button"
import useGetTag from "@/hooks/pantipTag/useGetTag"
import useUpdateTag from "@/hooks/pantipTag/useUpdateTag"

const UpdateTagForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);

  const form = props.form || initForm

  const { tag } = useGetTag(props.tagId)

  useEffect(() => {
    form.setFieldsValue(tag)
  }, [form, tag])

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => formData[k] === undefined)
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { updateTag } = useUpdateTag({
    onSuccess: () => {
      form.resetFields()
      props.onSuccess()
    },
  })

  const handleFinish = (value) => {
    updateTag(props.tagId, value)
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
      className='w-full w-full'
      form={form}
      onFinish={handleFinish}
      onFieldsChange={handleFormChange}
      requiredMark={false}
      initialValues={{
        status: 'active',
      }}
    > 
      <Form.Item
        label="Keyword"
        name="keyword"
        rules={[
          {
            required: true,
            message: 'Please input keyword!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Status"
        name="status"
      >
        <Radio.Group>
          <Radio value="active">Active</Radio>
          <Radio value="inactive">Inactive</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }} className="!mb-0">
        <div className='flex justify-center gap-4'>
          <Button
            _type="secondary"
            className='w-[100px]'
            onClick={() => {
              form.resetFields()
              props.onCancel()
            }}
          >
            Cancel
          </Button>
          <Button
            _type="primary"
            htmlType="submit"
            disabled={disabledSave}
          >
            Save Change
          </Button>
        </div>
      </Form.Item>
    </Form>

  )
}

const UpdateTagFormWithModal = (props) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm()

  const showModal = () => {
    setOpen(true);
  };

  const handleSuccess = () => {
    props.onSuccess?.()
    setOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <div>
      <div
        id={`edit-member-${props.tagId}`}
        className="[&_*]:text-main-orange cursor-pointer typo-b4"
        onClick={() => showModal()}
      >
        <EditOutlined /> <span>Edit</span>
      </div>
      <Modal
        open={open}
        title="Edit Keyword"
        onOk={handleSuccess}
        onCancel={handleCancel}
        footer={false}
        width={595}
        centered
        destroyOnClose
        className={classNames(
          '[&_.ant-modal-header]:!mb-4',
          '[&_.ant-modal-content]:!px-8',
          '[&_.ant-modal-content]:!py-8',
          '[&_.ant-modal-content]:!rounded-2xl',
        )}
      >
        <UpdateTagForm
          tagId={props.tagId}
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  UpdateTagFormWithModal,
  UpdateTagForm,
}