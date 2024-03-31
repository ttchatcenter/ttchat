import { useState, useEffect } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Switch } from "antd"
import { EditOutlined } from '@ant-design/icons'
import Button from "@/components/Button"
import useGetPlatform from "@/hooks/platform/useGetPlatform"
import useUpdatePlatform from "@/hooks/platform/useUpdatePlatform"
import config from "@/configs"

const UpdatePlatformForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let id
    if (copied) {
      id = setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
    return () => {
      clearTimeout(id)
    }
  }, [copied])

  const form = props.form || initForm

  const { platform } = useGetPlatform(props.platformId)

  useEffect(() => {
    form.setFieldsValue({
      ...platform,
      status: platform?.status === 'active',
    })
  }, [form, platform])

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => formData[k] === undefined)
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { updatePlatform } = useUpdatePlatform({
    onSuccess: () => {
      form.resetFields()
      props.onSuccess()
    },
  })

  const handleFinish = (value) => {
    updatePlatform(props.platformId, {
      ...value,
      status: value.status ? 'active' : 'inactive',
      type: 'line',
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
        status: true,
      }}
    > 
      <Form.Item
        label="Status"
        name="status"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="Channel Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input channel name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {
        platform?.type === 'line' ? (
          <>
            <Form.Item
              label="Channel ID"
              name="platform_id"
              rules={[
                {
                  required: true,
                  message: 'Please input channel name!',
                },
              ]}
            >
              <Input disabled={platform?.type !== 'line'} />
            </Form.Item>
            <Form.Item
              label="Channel Secret"
              name="platform_secret"
              rules={[
                {
                  required: true,
                  message: 'Please input channel name!',
                },
              ]}
            >
              <Input disabled={platform?.type !== 'line'} />
            </Form.Item>

            <div className="grid grid-cols-[3fr_1fr] items-baseline">
              <Form.Item
                label="Webhook Link"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  value={`${config.apiDomain}/api/line/webhook/${platform?.brand_id}/${platform.id}`}
                />
              </Form.Item>
              <div
                className="ml-3 flex gap-1 typo-c1 text-main-orange cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(`${config.apiDomain}/api/line/webhook/${platform?.brand_id}/${platform.id}`);
                  setCopied(true)
                }}
              >
                <span className="underline">{copied ? 'Copied!' : 'Copy'}</span>
              </div>
            </div>
            
          </>
        ) : undefined
      }
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
            className='w-[150px]'
            htmlType="submit"
            disabled={disabledSave}
          >
            Save change
          </Button>
        </div>
      </Form.Item>
    </Form>

  )
}

const UpdatePlatformFormWithModal = (props) => {
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
        className="[&_*]:text-main-orange cursor-pointer typo-b4"
        onClick={() => showModal()}
      >
        <EditOutlined /> <span>Edit</span>
      </div>
      <Modal
        open={open}
        title="Edit Platform"
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
        <UpdatePlatformForm
          platformId={props.platformId}
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  UpdatePlatformFormWithModal,
  UpdatePlatformForm,
}