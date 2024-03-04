import { useState, useEffect } from "react"
import classNames from "classnames"
import { Form, Input, Radio } from "antd"
import Button from "@/components/Button"
import useBrand from "@/hooks/common/useBrand"
import useUpdateCrm from "@/hooks/crm/useUpdateCrm"
import useGetCrm from "@/hooks/crm/useGetCrm"
import Modal from "@/components/Modal"

const CrmSettingPage = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const { brand } = useBrand()
  const { crm, refetch: refetchCrm } = useGetCrm(brand?.id)

  useEffect(() => {
    form.setFieldsValue(crm || {})
  }, [form, crm])

  const { updateCrm } = useUpdateCrm({
    onSuccess: () => {
      refetchCrm()
      setOpen(true)
    },
  })

  const handleFinish = (value) => {
    updateCrm(brand.id, value)
  }

  return (
    <div className="h-full w-full py-6 px-4">
      <h3 className="typo-hl2 text-accent-body-text">CRM Setting</h3>
      <div className={cardClass}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
          className='w-full w-full'
          form={form}
          onFinish={handleFinish}
          requiredMark={false}
          initialValues={{
            status: 'inactive',
          }}
        >
          <Form.Item
            label="Link"
            name="link"
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
              {/* <Button
                _type="secondary"
                className='w-[100px]'
                onClick={() => {
                  form.setFieldsValue(user)
                }}
              >
                Cancel
              </Button> */}
              <Button
                _type="primary"
                className='w-[150px]'
                htmlType="submit"
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
        title="CRM changed successfully"
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

export default CrmSettingPage