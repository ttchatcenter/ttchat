import { useState } from "react";
import {
  Form,
  Input,
} from 'antd';
import Button from "@/components/Button";
import UploadImageQuickReply from './uploadImage';
import useAddQuickReply from '@/hooks/quickReply/useAddQuickReply';
const { TextArea } = Input

const Add = (props) => {
  const [loading, setLoading] = useState(false)

  const { addQuickReply } = useAddQuickReply({
    onSuccess: () => {
      props.refetch()
      props.setType('list')
      setLoading(false)
    }
  })
  const [form] = Form.useForm();

  const onFinish = (value) => {
    setLoading(true)
    addQuickReply({
      brand_id: props.brand?.id,
      ...value
    })
  }

  return (
    <Form
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      layout='vertical'
      className='mx-auto'
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="message"
        label="Message"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <div className='flex gap-4'>
        {
          [0, 1, 2].map(i => (
            <Form.Item key={i} name={['image', i]}>
              <UploadImageQuickReply
                onChange={(v) => form.setFieldValue(`image-${i}`, v)}
              />
            </Form.Item>
          ))
        }
      </div>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div className='flex justify-center gap-2'>
          <Button
            htmlType="button"
            onClick={() => props.setType('list')}
            _type="secondary"
            _size="s"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            _type="primary"
            _size="s"
            loading={loading}
          >
            Add
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default Add