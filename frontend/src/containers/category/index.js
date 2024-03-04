import { useState } from "react"
import classNames from "classnames"
import { Row, Col, Space, Modal, Card, Switch } from "antd"
import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons"
import useBrand from "@/hooks/common/useBrand"
import useListCategory from "@/hooks/category/useListCategory"
import useListSubcategoryLevel1 from "@/hooks/subcategoryLevel1/useListSubcategoryLevel1"
import useListSubcategoryLevel2 from "@/hooks/subcategoryLevel2/useListSubcategoryLevel2"
import AddCategory from "./addCategory"
import AddSubcategoryLevel1 from "./addSubcategoryLevel1"
import AddSubcategoryLevel2 from "./addSubcategoryLevel2"
import useUpdateCategory from "@/hooks/category/useUpdateCategory"
import useUpdateSubcategoryLevel1 from "@/hooks/subcategoryLevel1/useUpdateSubcategoryLevel1"
import useUpdateSubcategoryLevel2 from "@/hooks/subcategoryLevel2/useUpdateSubcategoryLevel2"

const modalConfirmProp = {
  okButtonProps: {
    className:
      "!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red",
  },
  cancelButtonProps: {
    className: "hover:!border-main-orange hover:!text-main-orange",
  },
}

const CategorySetting = () => {
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState("") //category, subcategoryLevel1, subcategoryLevel2
  const [titleModal, setTitleModal] = useState()
  const [initialForm, setInitialForm] = useState()

  const [categoryID, setCategoryID] = useState()
  const [subcategoryID, setSubcategoryID] = useState()
  const [loadingCategory, setLoadingCategory] = useState({})
  const [loadingSubcategoryLevel1, setLoadingSubcategoryLevel1] = useState({})
  const [loadingSubcategoryLevel2, setLoadingSubcategoryLevel2] = useState({})

  const { brand } = useBrand()
  const { list: categoryData, refetch: refetchCategory } = useListCategory({
    brand_id: brand?.id,
  })

  const { list: subcategoryLevel1Data, refetch: refetchSubcategoryLevel1 } =
    useListSubcategoryLevel1({
      brand_id: brand?.id,
      category_id: categoryID,
    })

  const { list: subcategoryLevel2Data, refetch: refetchSubcategoryLevel2 } =
    useListSubcategoryLevel2({
      brand_id: brand?.id,
      category_id: categoryID,
      subcategory_level1_id: subcategoryID,
    })

  const { updateCategory } = useUpdateCategory({
    onSuccess: () => {
      refetchCategory()
      setLoadingCategory({})
    },
  })

  const { updateSubcategoryLevel1 } = useUpdateSubcategoryLevel1({
    onSuccess: () => {
      refetchSubcategoryLevel1()
      setLoadingSubcategoryLevel1({})
    },
  })

  const { updateSubcategoryLevel2 } = useUpdateSubcategoryLevel2({
    onSuccess: () => {
      refetchSubcategoryLevel2()
      setLoadingSubcategoryLevel2({})
    },
  })

  const handleClose = () => {
    setShowModal(false)
    setInitialForm()
  }

  const onClickCategory = (categoryID) => {
    setCategoryID(categoryID)
    setSubcategoryID()
  }

  const onClickSubcategoryLevel1 = (subcategoryID) => {
    setSubcategoryID(subcategoryID)
  }

  const onAdd = (type) => {
    setType(type)
    if (type === "category") {
      setTitleModal("Add Category")
    } else if (type === "subcategoryLevel1") {
      setTitleModal("Add Sub-Category Level 1")
    } else if (type === "subcategoryLevel2") {
      setTitleModal("Add Sub-Category Level 2")
    }
    setShowModal(true)
  }

  const onSwitchStatusCategory = (value, id) => {
    setLoadingCategory({ [id]: true })
    updateCategory(id, {
      status: value ? "active" : "inactive",
    })
  }

  const onSwitchStatusSubcategoryLevel1 = (value, id) => {
    setLoadingSubcategoryLevel1({ [id]: true })
    updateSubcategoryLevel1(id, {
      status: value ? "active" : "inactive",
    })
  }

  const onSwitchStatusSubcategoryLevel2 = (value, id) => {
    setLoadingSubcategoryLevel2({ [id]: true })
    updateSubcategoryLevel2(id, {
      status: value ? "active" : "inactive",
    })
  }

  const onEditCategory = (id) => {
    setType("category")
    setTitleModal("Edit Category")
    setShowModal(true)
    setInitialForm(categoryData.find((item) => item.id === id))
  }

  const onEditSubcategoryLevel1 = (id) => {
    setType("subcategoryLevel1")
    setTitleModal("Edit Sub-Category Level 1")
    setShowModal(true)
    setInitialForm(subcategoryLevel1Data.find((item) => item.id === id))
  }

  const onEditSubcategoryLevel2 = (id) => {
    setType("subcategoryLevel2")
    setTitleModal("Edit Sub-Category Level 1")
    setShowModal(true)
    setInitialForm(subcategoryLevel2Data.find((item) => item.id === id))
  }

  return (
    <div className="h-full w-full  px-4 flex flex-col gap-6 mt-6">
      <h3 className="text-accent-grey text-2xl pb-2 font-semibold ">
        Category Setting
      </h3>

      <div className={cardClass}>
        <Row gutter={[16]}>
          <Col span={8}>
            <Card
              title="Category"
              extra={
                <PlusCircleOutlined
                  className="cursor-pointer"
                  onClick={() => onAdd("category")}
                />
              }
            >
              {categoryData?.map((item) => (
                <p
                  className={classNames(
                    "p-2 cursor-pointer hover:bg-[#FCE0CA] hover:text-[#F17D23] flex justify-between",
                    categoryID === item.id && "bg-[#FCE0CA] text-[#F17D23]"
                  )}
                  key={item.id}
                  onClick={() => onClickCategory(item.id)}
                >
                  <span>{item?.name}</span>
                  <Space>
                    <EditOutlined onClick={() => onEditCategory(item.id)} />
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                      defaultChecked
                      className="_custom-switch"
                      checked={item.status === "active"}
                      onChange={(value, e) => {
                        onSwitchStatusCategory(value, item.id)
                        e.stopPropagation()
                      }}
                      loading={loadingCategory?.[item.id]}
                    />
                  </Space>
                </p>
              ))}
            </Card>
          </Col>
          <Col span={8}>
            {categoryID && (
              <Card
                title="Sub-Category Level 1"
                extra={
                  <PlusCircleOutlined
                    className="cursor-pointer"
                    onClick={() => onAdd("subcategoryLevel1")}
                  />
                }
              >
                {subcategoryLevel1Data?.map((item) => (
                  <p
                    className={classNames(
                      "p-2 cursor-pointer hover:bg-[#FCE0CA] hover:text-[#F17D23] flex justify-between",
                      subcategoryID === item.id && "bg-[#FCE0CA] text-[#F17D23]"
                    )}
                    key={item.id}
                    onClick={() => onClickSubcategoryLevel1(item.id)}
                  >
                    <span>{item?.name}</span>
                    <Space>
                      <EditOutlined
                        onClick={() => onEditSubcategoryLevel1(item.id)}
                      />
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        defaultChecked
                        className="_custom-switch"
                        checked={item.status === "active"}
                        onChange={(value, e) => {
                          onSwitchStatusSubcategoryLevel1(value, item.id)
                          e.stopPropagation()
                        }}
                        loading={loadingSubcategoryLevel1?.[item.id]}
                      />
                    </Space>
                  </p>
                ))}
              </Card>
            )}
          </Col>
          <Col span={8}>
            {subcategoryID && (
              <Card
                title="Sub-Category Level 2"
                extra={
                  <PlusCircleOutlined
                    className="cursor-pointer"
                    onClick={() => onAdd("subcategoryLevel2")}
                  />
                }
              >
                {subcategoryLevel2Data?.map((item) => (
                  <p
                    className="p-2 cursor-pointer hover:bg-[#FCE0CA] hover:text-[#F17D23] flex justify-between"
                    key={item.id}
                  >
                    <span>{item?.name}</span>
                    <Space>
                      <EditOutlined
                        onClick={() => onEditSubcategoryLevel2(item.id)}
                      />
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        defaultChecked
                        className="_custom-switch"
                        checked={item.status === "active"}
                        onChange={(value, e) => {
                          onSwitchStatusSubcategoryLevel2(value, item.id)
                          e.stopPropagation()
                        }}
                        loading={loadingSubcategoryLevel2?.[item.id]}
                      />
                    </Space>
                  </p>
                ))}
              </Card>
            )}
          </Col>
        </Row>

        <Modal
          open={showModal}
          title={titleModal}
          onOk={handleClose}
          onCancel={handleClose}
          footer={false}
          width={800}
          centered
          destroyOnClose
          className={classNames(
            "[&_.ant-modal-content]:!px-8",
            "[&_.ant-modal-content]:!py-8",
            "[&_.ant-modal-content]:!rounded-2xl"
          )}
        >
          {type === "category" && (
            <AddCategory
              handleClose={handleClose}
              refetch={refetchCategory}
              brand={brand}
              initialForm={initialForm}
            />
          )}

          {type === "subcategoryLevel1" && (
            <AddSubcategoryLevel1
              handleClose={handleClose}
              refetch={refetchSubcategoryLevel1}
              brand={brand}
              initialForm={initialForm}
              categoryID={categoryID}
            />
          )}

          {type === "subcategoryLevel2" && (
            <AddSubcategoryLevel2
              handleClose={handleClose}
              refetch={refetchSubcategoryLevel2}
              brand={brand}
              initialForm={initialForm}
              categoryID={categoryID}
              subcategoryLevel1ID={subcategoryID}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}

const cardClass = classNames("py-4 px-3", "rounded-2xl")

export default CategorySetting
