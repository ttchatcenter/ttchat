import { Form, Input } from "antd"
import Button from "@/components/Button"
import useAddCategory from "@/hooks/category/useAddCategory"
import { useEffect } from "react"
import useUpdateCategory from "@/hooks/category/useUpdateCategory"

const Add = ({ handleClose, refetch, brand, initialForm }) => {
  const { addCategory } = useAddCategory({
    onSuccess: () => {
      refetch()
      handleClose()
    },
  })

  const { updateCategory } = useUpdateCategory({
    onSuccess: () => {
      refetch()
      handleClose()
    },
  })

  const [form] = Form.useForm()

  useEffect(() => {
    console.log("initialForm", initialForm)
    if (initialForm) {
      form.setFieldsValue(initialForm)
    }
  }, [initialForm])

  const onFinish = (value) => {
    if (initialForm) {
      updateCategory(initialForm.id, {
        ...value,
      })
    } else {
      addCategory({
        brand_id: brand?.id,
        ...value,
      })
    }
  }

  return (
    <Form
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      layout="vertical"
      className="mx-auto"
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="code" label="Code">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex justify-center gap-2">
          <Button
            htmlType="button"
            onClick={handleClose}
            _type="secondary"
            _size="s"
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" _type="primary" _size="s">
            Save
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default Add
