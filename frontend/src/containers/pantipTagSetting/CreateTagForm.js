import { useState } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Radio } from "antd"
import Button from "@/components/Button"
import useBrand from "@/hooks/common/useBrand"
import useCreateTag from "@/hooks/pantipTag/useCreateTag"

const CreateTagForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);

  const { brand } = useBrand()

  const form = props.form || initForm

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => formData[k] === undefined)
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { createTag } = useCreateTag({
    onSuccess: () => {
      form.resetFields()
      props.onSuccess()
    },
  })

  const handleFinish = (value) => {
    createTag({
      brand_id: brand?.id,
      ...value,
    })
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
            className='w-[100px]'
            htmlType="submit"
            disabled={disabledSave}
          >
            Add
          </Button>
        </div>
      </Form.Item>
    </Form>

  )
}

const CreateTagFormWithModal = (props) => {
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
    <div className="flex gap-4">
      <Button
        _type="primary"
        _size="m"
        onClick={() => showModal()}
      >
        Add new keyword
      </Button>
      <Modal
        open={open}
        title="Add New Keyword"
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
        <CreateTagForm
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  CreateTagFormWithModal,
  CreateTagForm,
}