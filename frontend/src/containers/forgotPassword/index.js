import { useState } from 'react'
import classNames from 'classnames'
import { Form, Input } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Button from '@/components/Button'
import useUser from '@/hooks/common/useUser'
import Modal from "@/components/Modal"
import useForgotPassword from '@/hooks/auth/useForgotPassword'

const ForgotPasswordPage = () => {
  const { push } = useRouter()
  const [form] = Form.useForm();
  const [isSuccess, setIsSuccess] = useState(false)
  const [disabledSave, setDisabledSave] = useState(true);
  const [open, setOpen] = useState(false)
  const [displayErrorTag, setDisplayErrorTag] = useState(false)
  
  const handleFormChange = () => {
    const notFilled = !form.getFieldValue('username') || !form.getFieldValue('email')
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
    setDisplayErrorTag(false);
  }

  useUser({ redirectIfFound: '/brand-management' })

  const { forgotPassword, error } = useForgotPassword({
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: (result) => {
      if (result?.response?.data?.error === 'Username or email is invalid') {
        setDisplayErrorTag(true)
      } else {
        setOpen(true)
      }
    }
  })

  const handleFinish = (value) => {
    forgotPassword(value)
  }

  return (
    <div className={wrapperClass}>
      <div className="bg-[url('/images/bg-curve.png')] bg-cover bg-center" />
      <div className="flex flex-col items-center justify-center py-8">
        <img className="mb-9" src="/images/logo.png" />
        {
          isSuccess ? (
            <>
              <h3 className="typo-th-hd1 text-main-black">รหัสผ่านใหม่ถูกส่งเรียบร้อย</h3>
              <h5 className="typo-th-hl2 text-accent-grey pt-4 pb-40">
                เราได้ส่งรหัสผ่านใหม่ไปที่ <span className='typo-th-hl1'>{form.getFieldValue('email')}</span> เรียบร้อย <br /> กรุณาทำการเข้าสู่ระบบด้วยรหัสผ่านใหม่ที่ถูกส่งไป
              </h5>
              <Button
                _type="primary"
                _size='l'
                className='w-full max-w-[448px]'
                onClick={() => push('/login')}
              >
                Back
              </Button>
            </>
          ) : (
            <>
              <h3 className="typo-hd2 text-accent-body-text">Forgot Password</h3>
              <h5 className="typo-th-b2 text-accent-grey pt-4 pb-8">กรุณาระบุ username และ E-mail เพื่อรับรหัสผ่านใหม่</h5>
              {
                displayErrorTag ? (
                  <div className="flex gap-2 bg-[#F9C3C9] px-4 py-2 rounded-[4px] typo-th-b2 text-tag-red mb-6">
                    <InfoCircleOutlined />
                    <span>Username หรือ E-mail ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</span>  
                  </div>
                ) : undefined
              }
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
                <Form.Item wrapperCol={{ span: 24 }} className='!pt-8'>
                  <div className='flex flex-col gap-6'>
                    <Button
                      _type="primary"
                      _size='l'
                      className='w-full'
                      htmlType="submit"
                      disabled={disabledSave}
                    >
                      Submit
                    </Button>
                    <Button
                      _type="secondary"
                      _size='l'
                      className='w-full'
                      onClick={() => push('/login')}
                    >
                      Back
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </>
          )
        }
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        type="failed"
        title="Forgot password failed"
        description={error?.response?.data?.error}
        buttonText="Close"
      />
    </div>
  )
}

const wrapperClass = classNames(
  // 'h-full',
  'min-h-screen',
  'w-full',
  'grid',
  'grid-cols-1',
  'md:grid-cols-2'
)

export default ForgotPasswordPage