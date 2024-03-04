import { useState } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Radio, Select } from "antd"
import { SyncOutlined } from '@ant-design/icons'
import Button from "@/components/Button"
import randomPassword from "@/utils/randomPassword"
import useCreateUser from "@/hooks/user/useCreateUser"

const CreateUserForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);

  const form = props.form || initForm

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => !formData[k])
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { createUser } = useCreateUser({
    onSuccess: () => {
      form.resetFields()
      props.onSuccess()
    },
    onError: (error) => {
      console.log(error)
      Modal.error({
        title: 'Error!',
        content: error?.response?.data?.errors?.[0] || 'Error! Please try again later',
        okButtonProps: { className: '!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red' }
      })
    }
  })

  const handleFinish = (value) => {
    createUser(value)
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
        password: randomPassword(),
      }}
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
              required: true,
              message: 'Please input your password!',
            },
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
            className='w-[100px]'
            htmlType="submit"
            disabled={disabledSave}
          >
            Create
          </Button>
        </div>
      </Form.Item>
    </Form>

  )
}

const CreateUserFormWithModal = (props) => {
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
      <Button
        _type="primary"
        _size="m"
        className="w-[216px] !bg-main-red"
        onClick={() => showModal()}
      >
        Create new user
      </Button>
      <Modal
        open={open}
        title="Create New User"
        onOk={handleSuccess}
        onCancel={handleCancel}
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
        <CreateUserForm
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  CreateUserFormWithModal,
  CreateUserForm,
}