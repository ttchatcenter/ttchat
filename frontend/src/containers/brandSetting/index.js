import { useState, useEffect } from "react"
import classNames from "classnames"
import { Form, Input } from "antd"
import Button from "@/components/Button"
import useBrand from "@/hooks/common/useBrand"
import useUpdateBrand from "@/hooks/brand/useUpdateBrand"
import Modal from "@/components/Modal"
import Logo from "./Logo"

const GUIDE_LIST = [
  'สัดส่วนของรูปภาพควรเป็น 1:1 (สีเหลี่ยมจัตุรัส)',
  'ขนาดของภาพที่แนะนำ คือ 640 x 640 pixels.',
  'อัปโหลดรูปภาพได้ไม่เกิน 10 MB.',
  'รองรับเฉพาะไฟล์ .jpg, .jpeg, .png',
]

const BrandSettingPage = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).every(k => formData[k] === brand[k])
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { brand, refetch } = useBrand()

  useEffect(() => {
    form.setFieldsValue(brand)
  }, [form, brand])

  const { updateBrand } = useUpdateBrand({
    onSuccess: () => {
      refetch()
      setDisabledSave(true)
      setOpen(true)
    },
  })

  const handleFinish = (value) => {
    updateBrand(brand.id, value)
  }

  return (
    <div className="h-full w-full py-6 px-4">
      <h3 className="typo-hl2 text-accent-body-text">Brand Setting</h3>
      <div className={cardClass}>
        <div className="flex flex-col items-center justify-center gap-3 py-6 border border-dashed rounded-2xl mb-10">
          <Logo />
          <div className="bg-main-grey1 px-12 py-3 rounded typo-th-d1">
            {
              GUIDE_LIST.map(i => (
                <div key={i} className="flex items-center text-accent-grey">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-accent-grey" />
                  </div>
                  <div>{i}</div>
                </div>
              ))
            }
          </div>
        </div>
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
            label="Brand Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input brand name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'Please input brand description!',
              },
            ]}
          >
            <Input />
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
        title="Brand changed successfully"
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

export default BrandSettingPage