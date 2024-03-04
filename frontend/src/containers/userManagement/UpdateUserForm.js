import { useState, useEffect } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Radio, Select } from "antd"
import { SyncOutlined, EditOutlined } from '@ant-design/icons'
import Button from "@/components/Button"
import randomPassword from "@/utils/randomPassword"
import useGetUser from "@/hooks/user/useGetUser"
import useUpdateUser from "@/hooks/user/useUpdateUser"

const UpdateUserForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);

  const form = props.form || initForm

  const { user } = useGetUser(props.userId)

  useEffect(() => {
    form.setFieldsValue(user)
  }, [form, user])

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).every(k => formData[k] === user[k])
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { updateUser } = useUpdateUser({
    onSuccess: () => {
      props.onSuccess()
    },
  })

  const handleFinish = (value) => {
    updateUser(props.userId, value)
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
    >
      <Form.Item
        label="Employee ID"
        name="employee_id"
        rules={[
          {
            required: true,
            message: 'Please input your employee id!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="First Name"
        name="firstname"
        rules={[
          {
            required: true,
            message: 'Please input your first name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastname"
        rules={[
          {
            required: true,
            message: 'Please input your last name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input type="email" />
      </Form.Item>
      <div className="grid grid-cols-[3fr_1fr] items-baseline">
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve()
                }
                if (value.length < 8) {
                  return Promise.reject(new Error('Password should more than 8 characters!'))
                }
                if (!value.split('').some(i => '0123456789'.includes(i))) {
                  return Promise.reject(new Error('Password should contains at least 1 number!'))
                }
                if (!value.split('').some(i => 'abcdefghijklmnopqrstuvwxyz'.includes(i))) {
                  return Promise.reject(new Error('Password should contains at least 1 lowercase character!'))
                }
                if (!value.split('').some(i => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(i))) {
                  return Promise.reject(new Error('Password should contains at least 1 uppercase character!'))
                }
                if (!value.split('').some(i => '!@#$^*-_='.includes(i))) {
                  return Promise.reject(new Error('Password should contains at least 1 special character!'))
                }
                return Promise.resolve()
              },
            },
          ]}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Input.Password
            visibilityToggle={{
              visible: 'visible',
              onVisibleChange: () => {},
            }}
          />
        </Form.Item>
        <div
          className="ml-3 flex gap-1 typo-c1 text-main-orange cursor-pointer"
          onClick={() => form.setFieldValue('password', randomPassword())}
        >
          <SyncOutlined />
          <span className="underline">Regenerate</span>
        </div>
      </div>
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: 'Please select user role!',
          },
        ]}
      >
        <Select
          options={[
            { value: 'super_admin', label: 'SuperAdmin' },
            { value: 'supervisor', label: 'Supervisor' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
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

const UpdateUserFormWithModal = (props) => {
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
        title="Edit User Info"
        onOk={handleSuccess}
        onCancel={handleCancel}
        footer={false}
        width={595}
        centered
        destroyOnClose
        className={classNames(
          '[&_.ant-modal-header]:!mb-8',
          '[&_.ant-modal-content]:!px-8',
          '[&_.ant-modal-content]:!py-8',
          '[&_.ant-modal-content]:!rounded-2xl',
        )}
      >
        <UpdateUserForm
          userId={props.userId}
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  UpdateUserFormWithModal,
  UpdateUserForm,
}