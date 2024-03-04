import { Form, Input } from "antd"
import Button from "@/components/Button"
import { useEffect } from "react"
import useAddSubcategoryLevel2 from "@/hooks/subcategoryLevel2/useAddSubcategoryLevel2"
import useUpdateSubcategoryLevel2 from "@/hooks/subcategoryLevel2/useUpdateSubcategoryLevel2"

const Add = ({
  handleClose,
  refetch,
  brand,
  initialForm,
  categoryID,
  subcategoryLevel1ID,
}) => {
  const { addSubcategoryLevel2 } = useAddSubcategoryLevel2({
    onSuccess: () => {
      refetch()
      handleClose()
    },
  })

  const { updateSubcategoryLevel2 } = useUpdateSubcategoryLevel2({
    onSuccess: () => {
      refetch()
      handleClose()
    },
  })

  const [form] = Form.useForm()

  useEffect(() => {
    if (initialForm) {
      form.setFieldsValue(initialForm)
    }
  }, [initialForm])

  const onFinish = (value) => {
    if (initialForm) {
      updateSubcategoryLevel2(initialForm.id, {
        ...value,
      })
    } else {
      addSubcategoryLevel2({
        brand_id: brand?.id,
        category_id: categoryID,
        subcategory_level1_id: subcategoryLevel1ID,
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
