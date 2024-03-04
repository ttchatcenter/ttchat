import { useState } from 'react'
import classNames from 'classnames'
import { Form, Input } from 'antd'
import { useRouter } from 'next/router'
import Button from '@/components/Button'
import { CheckedCircle } from '@/components/Icons'
import useUser from '@/hooks/common/useUser'
import useResetPassword from '@/hooks/auth/useResetPassword'
import PasswordGuideBox from '@/components/PasswordGuideBox'

const NewPassword = () => {
  const { push } = useRouter()
  const [form] = Form.useForm();
  const [isSuccess, setIsSuccess] = useState(false)
  const [disabledSave, setDisabledSave] = useState(true);
  const [password, setPassword] = useState('')
  
  const handleFormChange = () => {
    const notFilled = !form.getFieldValue('password') || !form.getFieldValue('confirmPassword')
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setPassword(form.getFieldValue('password'))
    setDisabledSave(notFilled || hasErrors);
  }

  useUser({ redirectIfNotFound: '/login' })

  const { resetPassword } = useResetPassword({
    onSuccess: () => {
      setIsSuccess(true)
    }
  })

  const handleFinish = (value) => {
    resetPassword(value)
  }

  return (
    <div className={wrapperClass}>
      <div className="bg-[url('/images/bg-curve-2.png')] bg-cover bg-center min-h-screen flex items-center justify-center">
        <div className={`flex flex-col bg-main-white ${isSuccess ? 'px-10 py-12' : 'px-14 py-12'} rounded-xl shadow-[0px_4px_4px_0px_#00000040]`}>
          {
            isSuccess ? (
              <>
                <CheckedCircle className="w-20 h-20 m-auto mb-[30px]" />
                <h3 className="typo-hl1 text-base-grey6 m-auto">Password changed reset</h3>
                <h5 className="typo-th-shl3 text-accent-grey pt-2 pb-12 m-auto">
                  ตั้งรหัสผ่านใหม่สำเร็จ
                </h5>
                <Button
                  _type="primary"
                  _size='l'
                  className='w-full min-w-[480px]'
                  onClick={() => push('/brand-management')}
                >
                  Back to home
                </Button>
              </>
            ) : (
              <>
                <img className="w-24 mb-6" src="/images/logo.png" />
                <h3 className="typo-hl1 text-base-grey6">Set New Password</h3>
                <h5 className="typo-th-shl3 text-accent-grey pt-2 pb-5">กรุณาตั้งรหัสผ่านใหม่</h5>
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  layout="horizontal"
                  className='w-[540px]'
                  form={form}
                  onFinish={handleFinish}
                  onFieldsChange={handleFormChange}
                  requiredMark={false}
                >
                  <Form.Item
                    label="New Password"
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
                            return Promise.reject(new Error(''))
                          }
                          if (!value.split('').some(i => '0123456789'.includes(i))) {
                            return Promise.reject(new Error(''))
                          }
                          if (!value.split('').some(i => 'abcdefghijklmnopqrstuvwxyz'.includes(i))) {
                            return Promise.reject(new Error(''))
                          }
                          if (!value.split('').some(i => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(i))) {
                            return Promise.reject(new Error(''))
                          }
                          if (!value.split('').some(i => '!@#$^*-_='.includes(i))) {
                            return Promise.reject(new Error(''))
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                  wrapperCol={{ offset: 8, span: 16 }}
                >
                  <PasswordGuideBox password={password} />
                </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24 }} className='!pt-14 !mb-0'>
                    <Button
                      _type="primary"
                      _size='l'
                      className='w-full'
                      htmlType="submit"
                      disabled={disabledSave}
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

const wrapperClass = classNames(
  'min-h-screen',
  'w-full',
)

export default NewPassword