/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react"
import classNames from "classnames"
import { Modal, Form, Input } from "antd"
import { PictureOutlined } from "@ant-design/icons"
import Button from "@/components/Button"
import useCreateBrand from "@/hooks/brand/useCreateBrand"

const GUIDE_LIST = [
  'สัดส่วนของรูปภาพควรเป็น 1:1 (สีเหลี่ยมจัตุรัส)',
  'ขนาดของภาพที่แนะนำ คือ 640 x 640 pixels.',
  'อัปโหลดรูปภาพได้ไม่เกิน 10 MB.',
  'รองรับเฉพาะไฟล์ .jpg, .jpeg, .png',
]

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateBrandForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true)
  const [logo, setLogo] = useState(undefined)
  const [preview, setPreview] = useState(undefined)
  const [loading, setLoading] = useState(false)

  const form = props.form || initForm

  useEffect(() => {
    handleFormChange()
  }, [logo])

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notImg = !logo
    const notFilled = Object.keys(form.getFieldsValue()).some(k => !formData[k])
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notImg || notFilled || hasErrors);
  }

  const { createBrand } = useCreateBrand({
    onSuccess: () => {
      form.resetFields()
      props.onSuccess()
      setLoading(false)
    },
  })

  const handleFinish = (value) => {
    setLoading(true)
    createBrand({
      ...value,
      logo,
    })
  }

  const handleClickEdit = () => {
    document.getElementById('upload').click()
  }

  const handleFileChange = async (e) => {
    const img = await getBase64(e.target.files?.[0])
    setLogo(e.target.files?.[0])
    setPreview(img)
  }

  return (
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
        wrapperCol={{ span: 24 }}
      >
        <div className="flex flex-col items-center justify-center gap-3 py-6 border border-dashed rounded-2xl">
          {
            preview ? (
              <img
                src={preview}
                onClick={handleClickEdit}
                className="w-[100px] h-[100px] rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div
                className="w-[100px] h-[100px] rounded-full bg-accent-light-bg2 flex items-center justify-center cursor-pointer"
                onClick={handleClickEdit}
              >
                <PictureOutlined className="text-2xl !text-main-grey2" />
              </div>
            )
          }
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
      </Form.Item>
      <Form.Item
        label="Brand name"
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
              form.resetFields()
              props.onCancel()
            }}
          >
            Cancel
          </Button>
          <Button
            _type="primary"
            className='w-[100px]'
            htmlType="submit"
            disabled={disabledSave}
            loading={loading}
          >
            Create
          </Button>
        </div>
      </Form.Item>
      <input
        type="file"
        id="upload"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="!hidden"
      />
    </Form>

  )
}

const CreateBrandFormWithModal = (props) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm()

  const showModal = () => {
    setOpen(true);
  };

  const handleSuccess = () => {
    props.onSuccess?.()
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        _type="primary"
        _size="m"
        className="!absolute inset-y-0 right-0 w-[216px] !bg-main-red"
        onClick={() => showModal()}
      >
        Create new brand
      </Button>
      <Modal
        open={open}
        title="Create New Brand"
        onOk={handleSuccess}
        onCancel={handleCancel}
        footer={false}
        width={595}
        centered
        className={classNames(
          '[&_.ant-modal-header]:!mb-8',
          '[&_.ant-modal-content]:!px-8',
          '[&_.ant-modal-content]:!py-8',
          '[&_.ant-modal-content]:!rounded-2xl',
        )}
      >
        <CreateBrandForm
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  CreateBrandFormWithModal,
  CreateBrandForm,
}