import classNames from 'classnames'
import { Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@/components/Button'
import config from '@/configs'
import dayjs from 'dayjs'
import Modal from "@/components/Modal"
import useLogin from '@/hooks/auth/useLogin'
import useUser from '@/hooks/common/useUser'

const LoginPage = () => {
  const { push } = useRouter()
  const [form] = Form.useForm()

  const { user, refetch } = useUser()
  
  const [open, setOpen] = useState(false)
  const [disabledSave, setDisabledSave] = useState(true);
  
  const handleFormChange = () => {
    const notFilled = !form.getFieldValue('username') || !form.getFieldValue('password')
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  useEffect(() => {
    if (user?.is_reset_password) {
      push('/new-password')
    } else if (user?.should_change_password) {
      push('/expired-password')
    } else if (user) {
      push('/brand-management')
    }
  }, [user, push])

  const { login, error } = useLogin({
    onSuccess: (result) => {
      window.localStorage.setItem(config.userSessionKey, JSON.stringify({ ...result, loginTime: dayjs() }))
      refetch()
    },
    onError: () => {
      setOpen(true)
    }
  })

  const handleFinish = (value) => {
    login(value)
  }

  return (
    <div className={wrapperClass}>
      <div className="bg-[url('/images/bg-curve.png')] bg-cover bg-center" />
      <div className="flex flex-col items-center justify-center py-10">
        <img className="mb-9" src="/images/logo.png" />
        <h3 className="typo-hd2 text-accent-body-text">Welcome back</h3>
        <h5 className="typo-shl3 text-accent-grey pt-4 pb-9">Please sign-in to your account</h5>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          className='w-full max-w-[448px]'
          form={form}
          onFinish={handleFinish}
          onFieldsChange={handleFormChange}
          requiredMark={false}
        >
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
            label="Password"
            name="password"
            className='!mb-4'
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <span
              className='typo-c1 float-right !text-main-orange cursor-pointer'
              onClick={() => push('/forgot-password')}
            >
              Forgot password
            </span>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} className='!pt-4'>
            <Button
              _type="primary"
              htmlType='submit'
              _size='l'
              className='w-full'
              disabled={disabledSave}
            >
              Sign-in
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        type="failed"
        title="Login failed"
        description={error?.response?.data?.error}
        buttonText="Close"
      />
    </div>
  )
}

const wrapperClass = classNames(
  'h-full',
  'min-h-screen',
  'w-full',
  'grid',
  'grid-cols-1',
  'md:grid-cols-2'
)

export default LoginPage