import { useState, useEffect } from "react"
import classNames from "classnames"
import { Form, Input } from "antd"
import Button from "@/components/Button"
import useUser from "@/hooks/common/useUser"
import useUpdateUser from "@/hooks/user/useUpdateUser"
import Modal from "@/components/Modal"
import { ChangePasswordFormWithModal } from "./ChangePasswordForm"
import Avatar from "./Avatar"

const MyAccountPage = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).every(k => formData[k] === user[k])
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { user, refetch } = useUser()

  useEffect(() => {
    form.setFieldsValue(user)
  }, [form, user])

  const { updateUser } = useUpdateUser({
    onSuccess: () => {
      refetch()
      setDisabledSave(true)
      setOpen(true)
    },
  })

  const handleFinish = (value) => {
    updateUser(user.id, value)
  }

  return (
    <div className="h-full w-full py-6 px-4">
      <h3 className="typo-hl2 text-accent-body-text">My Account</h3>
      <div className={cardClass}>
        <Avatar />
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
          >
            <Input disabled />
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
                required: true,
                message: 'Please input your email!',
              },
              { 
                type: 'email',
                message: 'Email was not in the correct format!',
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="tel"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve()
                  }
                  if (value.length !== 10) {
                    return Promise.reject(new Error('Phone number should be 10 digits!'))
                  }
                  if (!/^[0-9]{10}$/.test(value)) {
                    return Promise.reject(new Error('Phone number should contain only digits!'))
                  }
                  return Promise.resolve()
                },
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
            <Input disabled />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 18 }} className="!mb-6">
            <ChangePasswordFormWithModal />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} className="!mb-0">
            <div className='flex justify-center gap-4'>
              <Button
                _type="secondary"
                className='w-[100px]'
                onClick={() => {
                  form.setFieldsValue(user)
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
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        type="success"
        title="Profile changed successfully"
        description="บันทึกข้อมูลสำเร็จ"
        buttonText="Close"
      />
    </div>
  )
}

const cardClass = classNames(
  'bg-main-white border border-main-grey2',
  'py-8 px-16',
  'rounded-2xl',
  'mt-16 mx-auto',
  'w-full max-w-[796px]'
)

export default MyAccountPage