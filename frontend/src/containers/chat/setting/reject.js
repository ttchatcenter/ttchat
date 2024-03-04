import { useState } from "react"
import { Form, Select } from "antd"
import Button from "@/components/Button"
import useRejectChat from "@/hooks/chat/useRejectChat"
import useGetRejects from "@/hooks/chat/useGetRejects"

const Reject = (props) => {
  const { data, pantip, setState } = props

  const [disabledSave, setDisabledSave] = useState(true);

  const [form] = Form.useForm()

  const { list } = useGetRejects()

  const { reject } = useRejectChat({
    onSuccess: () => {
      form.resetFields()
      props.setSelected(undefined)
      setState('main')
    }
  })

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => formData[k] === undefined)
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const handleFinish = (value) => {
    reject(data?.id, value.reason)
  }

  return (
    <>
      <div className={`${pantip ? 'h-[calc(100vh-81px-162px-87px)]' : 'h-[calc(100vh-81px-162px-0px)]'} overflow-y-scroll flex flex-col p-4 gap-4 w-full`}>
        <div className="typo-shl1 text-accent-grey">Case Management</div>
        <div className="typo-th-c3 text-main-grey4">
          กรุณาเลือก Reason ก่อนทำการ submit
        </div>
        <div>
          <Form
            form={form}
            name="close-chat"
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
            onFieldsChange={handleFormChange}
            className="text-accent-body-text typo-th-b2"
          >
            <Form.Item
              label="Reason :"
              name="reason"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Select>
                {
                  list?.map(i => (
                    <Select.Option key={i.id} value={i.name}>{i.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="flex flex-col gap-[10px] px-4 py-8">
        <Button
          _type="primary"
          className="typo-th-shl3"
          disabled={disabledSave}
          onClick={() => form.submit()}
        >
          Submit
        </Button>
        <Button
          _type="secondary"
          className="typo-th-shl3"
          onClick={() => {
            form.resetFields()
            setState('main')
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

export default Reject