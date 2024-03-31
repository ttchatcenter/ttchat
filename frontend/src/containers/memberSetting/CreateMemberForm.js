import { useState } from "react"
import classNames from "classnames"
import { Modal, Form, Input, Radio, Select } from "antd"
import Button from "@/components/Button"
import useBrand from "@/hooks/common/useBrand"
import useListUser from "@/hooks/user/useListUsers"
import useCreateBrandMember from "@/hooks/brandMember/useCreateBrandMember"
import { firstLetterUpperCase } from "@/utils"

const CreateMemberForm = (props) => {
  const [initForm] = Form.useForm()
  const [disabledSave, setDisabledSave] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterSource, setFilterSource] = useState(['facebook', 'line', 'messenger', 'pantip', 'inbox', 'twitter', 'dm'])

  const { brand } = useBrand()
  const { users } = useListUser({})

  const form = props.form || initForm

  const handleFormChange = () => {
    const formData = form.getFieldsValue()
    const notFilled = Object.keys(form.getFieldsValue()).some(k => formData[k] === undefined)
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

    const list = [];
    [1, 2, 3, 4, 5, 6, 7].forEach((v) => {
      if (formData[`platform_${v}`] !== 'none') {
        list.push(formData[`platform_${v}`])
      }
    })
    setFilterSource(list)

    setDisabledSave(notFilled || hasErrors);
  }

  const { createBrandMember } = useCreateBrandMember({
    onSuccess: (value) => {
      form.resetFields()
      setSelectedUser({})
      props.onSuccess(value)
      setLoading(false)
    },
  })

  const handleFinish = (value) => {
    setLoading(true)
    createBrandMember({ brand_id: brand?.id, ...value })
  }

  const options = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'messenger', label: 'Messenger' },
    { value: 'line', label: 'Line OA' },
    { value: 'pantip', label: 'Pantip' },
    { value: 'inbox', label: 'Pantip Inbox' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'dm', label: 'Twitter Dm' },
    { value: 'none', label: 'None' },
  ].filter(i => !filterSource.includes(i.value))

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
        status: 'active',
        platform_1: 'facebook',
        platform_2: 'messenger',
        platform_3: 'line',
        platform_4: 'pantip',
        platform_5: 'inbox',
        platform_6: 'twitter',
        platform_7: 'dm',
        concurrent_1: 0,
        concurrent_2: 0,
        concurrent_3: 0,
        concurrent_4: 0,
        concurrent_5: 0,
        concurrent_6: 0,
        concurrent_7: 0,
      }}
    >
      <div className="pb-4">General Info</div>
      <Form.Item
        label="Fullname"
        name="user_id"
        rules={[
          {
            required: true,
            message: 'Please select user!',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOption}
          onChange={(v) => setSelectedUser(users?.find(i => i.id === v))}
          options={users?.sort((a, b) => a.status === 'inactive' ? 1 : -1)?.map(({ id, firstname, lastname }) => ({ value: id, label: `${firstname} ${lastname}` }))}
        />
      </Form.Item>
      <Form.Item
        label="Employee ID"
      >
        <Input
          value={selectedUser?.employee_id}
          disabled
        />
      </Form.Item>
      <Form.Item
        label="Username"
      >
        <Input
          value={selectedUser?.username}
          disabled
        />
      </Form.Item>
      <Form.Item
        label="Email"
      >
        <Input
          value={selectedUser?.email}
          disabled
        />
      </Form.Item>
      <Form.Item
        label="Role"
      >
        <Input
          value={selectedUser?.role?.split('_').map(firstLetterUpperCase).join('')}
          disabled
        />
      </Form.Item>
      <Form.Item
        label="Display name"
        name="display_name"
        rules={[
          {
            required: true,
            message: 'Please input display name!',
          },
        ]}
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
      <div className="pb-4">Platform Prioritization</div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 1"
          name="platform_1"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={[
              { value: 'facebook', label: 'Facebook' },
              { value: 'messenger', label: 'Messenger' },
              { value: 'line', label: 'Line OA' },
              { value: 'pantip', label: 'Pantip' },
              { value: 'inbox', label: 'Pantip Inbox' },
              { value: 'twitter', label: 'Twitter' },
              { value: 'dm', label: 'Twitter Dm' },
              { value: 'none', label: 'None' },
            ].filter(i => !filterSource.includes(i.value))}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_1"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 2"
          name="platform_2"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_2"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 3"
          name="platform_3"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_3"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 4"
          name="platform_4"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_4"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 5"
          name="platform_5"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_5"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 6"
          name="platform_6"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_6"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-[303fr_185fr] gap-4">
        <Form.Item
          label="Platform 7"
          name="platform_7"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Select
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="Concurrent"
          name="concurrent_7"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
        >
          <Input type="number" />
        </Form.Item>
      </div>
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
    </Form>

  )
}

const CreateMemberFormWithModal = (props) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm()

  const showModal = () => {
    setOpen(true);
  };

  const handleSuccess = (value) => {
    props.onSuccess?.(value)
    setOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <div>
      <Button
        _type="primary"
        _size="m"
        className="w-[148px] !bg-main-red"
        onClick={() => showModal()}
      >
        Add member
      </Button>
      <Modal
        open={open}
        title="Add member"
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
        <CreateMemberForm
          form={form}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}



export {
  CreateMemberFormWithModal,
  CreateMemberForm,
}