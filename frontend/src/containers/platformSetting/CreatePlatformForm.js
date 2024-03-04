import { useEffect, useState } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Switch, Table, Checkbox } from "antd"
import { SyncOutlined } from "@ant-design/icons"
import Button from "@/components/Button"
import useBrand from "@/hooks/common/useBrand"
import useCreatePlatform from "@/hooks/platform/useCreatePlatform"
import useCreateFacebookPlatform from "@/hooks/platform/useCreateFacebookPlatform"
import useCheckPlatform from "@/hooks/platform/useCheckPlatform"
import { handleLinkPage } from "@/libs/fb"

const CreatePlatformForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);
  const { brand } = useBrand()

  const form = props.form || initForm

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => formData[k] === undefined)
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    setDisabledSave(notFilled || hasErrors);
  }

  const { createPlatform } = useCreatePlatform({
    onSuccess: () => {
      form.resetFields()
      props.onSuccess()
    },
  })

  const handleFinish = (value) => {
    createPlatform({
      brand_id: brand?.id,
      ...value,
      status: value.status ? 'active' : 'inactive',
      type: 'line',
    })
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
      initialValues={{
        status: true,
      }}
    > 
      <Form.Item
        label="Status"
        name="status"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="Channel Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input channel name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Channel ID"
        name="platform_id"
        rules={[
          {
            required: true,
            message: 'Please input channel name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Channel Secret"
        name="platform_secret"
        rules={[
          {
            required: true,
            message: 'Please input channel name!',
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
          >
            Create
          </Button>
        </div>
      </Form.Item>
    </Form>

  )
}

const CreatePlatformFormWithModal = (props) => {
  const [open, setOpen] = useState(false);
  const [fbOpen, setfbOpen] = useState(false);
  const [fbUser, setFbUser] = useState({});
  const [fbPages, setFbPages] = useState([]);
  const [selectPages, setSelectPages] = useState([]);
  const [form] = Form.useForm()
  const { brand } = useBrand()
  const { createFacebookPlatform, isLoading } = useCreateFacebookPlatform({
    onSuccess: () => {
      props.onSuccess()
      setFbPages([])
      setSelectPages([])
      setFbUser({})
    },
  })

  const { platform: checkedPlatform } = useCheckPlatform(fbPages.map(i => i.id))

  useEffect(() => {
    if (checkedPlatform) {
      const selected = fbPages.filter(i => {
        const pf = checkedPlatform.find(j => j.platform_id === i.id)
        return !pf || (pf?.brand_id === brand?.id)
      })
      setSelectPages(selected)
    }
  }, [checkedPlatform, fbPages])

  const showModal = () => {
    setOpen(true);
  };

  const handleSuccess = () => {
    props.onSuccess?.()
    setOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleAddFacebook = () => {
    handleLinkPage((user, pages) => {
      setFbUser(user)
      setFbPages(pages)
      setfbOpen(true)
    })
  }

  const handleFbSuccess = () => {
    setfbOpen(false);
    createFacebookPlatform(brand?.id, fbUser, selectPages)
  };


  return (
    <div className="flex gap-4">
      <Button
        _type="secondary"
        _size="m"
        onClick={() => showModal()}
        className="[&]:!border-[#00B900] [&]:hover:!border-[#00B900] [&&&&_*]:hover:!text-[#00B900] hover:!bg-white"
      >
        <img src="/images/line-icon.png" className="mr-2" />
        <span className="[&&&&&]:!text-[#00B900]">Add Line Platform</span>
      </Button>
      <Button
        _type="secondary"
        _size="m"
        onClick={handleAddFacebook}
        className="[&]:!border-[#1877F2] [&]:hover:!border-[#1877F2] [&&&&_*]:hover:!text-[#1877F2] hover:!bg-white"
        disabled={isLoading}
      >
        {
          isLoading ? (
            <SyncOutlined className="[&&&&_*]:!text-[#1877F2] mr-2" spin />
          ) : (
            <img src="/images/fb-icon.png" className="mr-2" />
          )
        }
        <span className="[&&&&&]:!text-[#1877F2]">Add Facebook Platform</span>
      </Button>
      <Modal
        open={fbOpen}
        title="Add Facebook Platform"
        onOk={handleFbSuccess}
        onCancel={() => {
          setfbOpen(false)
          setFbPages([])
          setSelectPages([])
          setFbUser({})
        }}
        width={768}
        centered
        destroyOnClose
        className={classNames(
          '[&_.ant-modal-header]:!mb-4',
          '[&_.ant-modal-content]:!px-8',
          '[&_.ant-modal-content]:!py-8',
          '[&_.ant-modal-content]:!rounded-2xl',
        )}
      >
        <Table
          columns={[
            {
              title: '',
              dataIndex: 'id',
              width: 60,
              align: 'center',
              render: (id, record) => (
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectPages([...selectPages, record])
                    } else {
                      setSelectPages(selectPages.filter(i => i.id !== id))
                    }
                  }}
                  disabled={checkedPlatform?.find(i => i.platform_id === id)}
                  checked={selectPages.find(i => i.id === id)}
                />
              ),
            },
            {
              title: 'Page Id',
              dataIndex: 'id',
            },
            {
              title: 'Page Name',
              dataIndex: 'name',
            },
            {
              title: 'remark',
              dataIndex: 'id',
              render: (id, record) => {
                if (checkedPlatform?.find(i => i.platform_id === id)) {
                  return 'This page is used in other brand.'
                }
                return '-'
              }
            },
          ]}
          dataSource={fbPages}
        />
      </Modal>
      <Modal
        open={open}
        title="Add Line Platform"
        onOk={handleSuccess}
        onCancel={handleCancel}
        footer={false}
        width={595}
        centered
        destroyOnClose
        className={classNames(
          '[&_.ant-modal-header]:!mb-4',
          '[&_.ant-modal-content]:!px-8',
          '[&_.ant-modal-content]:!py-8',
          '[&_.ant-modal-content]:!rounded-2xl',
        )}
      >
        <CreatePlatformForm
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  CreatePlatformFormWithModal,
  CreatePlatformForm,
}