import { useState } from "react"
import { Form, Select } from "antd"
import Button from "@/components/Button"
import useCloseChat from "@/hooks/chat/useCloseChat"
import useBrand from "@/hooks/common/useBrand"
import useListCategory from "@/hooks/category/useListCategory"
import useListSubcategoryLevel1 from "@/hooks/subcategoryLevel1/useListSubcategoryLevel1"
import useListSubcategoryLevel2 from "@/hooks/subcategoryLevel2/useListSubcategoryLevel2"

const Close = (props) => {
  const { data, pantip, setState } = props

  // const [disabledSave, setDisabledSave] = useState(true)
  const [categoryID, setCategoryID] = useState()
  const [subcategoryID, setSubcategoryID] = useState()
  const [subcategoryID2, setSubcategoryID2] = useState()

  const [form] = Form.useForm()

  const { brand } = useBrand()
  const { list: categoryData } = useListCategory({
    brand_id: brand?.id,
    status: "active",
  })
  const { list: subcategoryLevel1Data, isSuccess: level1Success } = useListSubcategoryLevel1({
    brand_id: brand?.id,
    category_id: categoryID,
    status: "active",
  })
  const { list: subcategoryLevel2Data, isSuccess: level2Success } = useListSubcategoryLevel2({
    brand_id: brand?.id,
    category_id: categoryID,
    subcategory_level1_id: subcategoryID,
    status: "active",
  })

  const { close } = useCloseChat({
    onSuccess: () => {
      form.resetFields()
      props.setSelected(undefined)
      setState("main")
    },
  })

  // const handleFormChange = () => {
    // const formData = form.getFieldsValue()
    // const notFilled = ['category', 'subcategory', 'subcategoryLevel2']
    // .filter((i) => {
    //   if (i === 'category') {
    //     return true
    //   } else if (i === 'subcategory' && subcategoryLevel1Data.length && level1Success) {
    //     return true
    //   } else if (i === 'subcategoryLevel2' && subcategoryLevel2Data.length && level2Success) {
    //     return true
    //   }
    //   return false
    // })
    // .some(
    //   (k) => formData[k] === undefined
    // )
    // const hasErrors = form.getFieldsError().some(({ errors }) => errors.length)

    // setDisabledSave(notFilled || hasErrors)
  // }

  const disabledSave = !(categoryID &&
    (subcategoryID || (!subcategoryLevel1Data.length && level1Success)) && 
    (subcategoryID2 || (!subcategoryLevel2Data.length && level2Success)))

  const handleFinish = (value) => {
    close(data?.id, value.category, value.subcategory, value.subcategoryLevel2)
  }

  const onChangeCategory = (value) => {
    setCategoryID(value)
    setSubcategoryID()
    setSubcategoryID2()
    form.setFieldsValue({
      subcategory: undefined,
      subcategoryLevel2: undefined,
    })
  }

  const onChangeSubcategoryLevel1 = (value) => {
    setSubcategoryID(value)
    setSubcategoryID2()
    form.setFieldsValue({
      subcategoryLevel2: undefined,
    })
  }

  const onChangeSubcategoryLevel2 = (value) => {
    setSubcategoryID2(value)
  }


  return (
    <>
      <div
        className={`${
          pantip
            ? "h-[calc(100vh-81px-162px-87px)]"
            : "h-[calc(100vh-81px-162px-0px)]"
        } overflow-y-scroll flex flex-col p-4 gap-4 w-full`}
      >
        <div className="typo-shl1 text-accent-grey">Case Management</div>
        <div className="typo-th-c3 text-main-grey4">
          กรุณาเลือก category และ sub-category ก่อนทำการ submit
        </div>
        <div>
          <Form
            form={form}
            name="close-chat"
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
            // onFieldsChange={handleFormChange}
            className="text-accent-body-text typo-th-b2"
          >
            <Form.Item
              label="Category :"
              name="category"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <Select onChange={onChangeCategory}>
                {categoryData?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {subcategoryLevel1Data.length > 0 && (
              <Form.Item
                label="Sub-Category :"
                name="subcategory"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <Select onChange={onChangeSubcategoryLevel1}>
                  {subcategoryLevel1Data?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {subcategoryID && subcategoryLevel2Data.length > 0 && (
              <Form.Item
                label="Sub-Category Level 2 :"
                name="subcategoryLevel2"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <Select  onChange={onChangeSubcategoryLevel2}>
                  {subcategoryLevel2Data?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
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
            setState("main")
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

export default Close
