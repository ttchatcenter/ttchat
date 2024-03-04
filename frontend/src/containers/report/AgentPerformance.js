import { useState } from "react"
import classNames from "classnames"
import {
  Table,
  Form,
  Row,
  Col,
  TimePicker,
  Space,
  DatePicker,
  Input,
  Modal,
} from "antd"
import Button from "@/components/Button"
import { SearchOutlined } from "@ant-design/icons"
import useListAgentPerformance from "@/hooks/report/useListAgentPerformance"
import * as XLSX from "xlsx"
import useBrand from "@/hooks/common/useBrand"
import dayjs from "dayjs"

const { RangePicker } = DatePicker

const AgentPerformance = () => {
  const [params, setParams] = useState({
    date_start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    date_end: dayjs().format("YYYY-MM-DD HH:mm"),
  })
  const { brand } = useBrand()

  const { list: data, isLoading } = useListAgentPerformance({
    brand_id: brand?.id,
    ...params,
  })

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0")
  }

  const renderTimeFormat = (minute) => {
    const totalSeconds = minute * 60
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const hours = Math.floor(totalSeconds / 3600)
    return `${hours}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
  }

  const exportExcel = async () => {
    const workbook = XLSX.utils.book_new()
    const worksheetDatas = []

    const headerColumn = {
      agent_name: "Agent name",
      employee_id: "Employee ID",
      total_chat_handled: "Total Chat Handled",
      total_chat_handling_time: "Total Chat Handled Time",
      total_no_response: "Total Chat No Response",
      avg_aht_per_chat: "AHT Per Chat",
      total_available: "Available",
      total_awc: "ACW",
      total_break: "Break",
      total_toilet: "Toilet",
      total_meeting: "Meeting",
      total_consult: "Consult",
      total_training: "Training",
      total_special_assign: "Special Assign",
    }

    worksheetDatas.push(headerColumn)

    data.forEach((item) => {
      let {
        agent_name,
        employee_id,
        total_chat_handled,
        total_chat_handling_time,
        total_no_response,
        avg_aht_per_chat,
        total_available,
        total_awc,
        total_break,
        total_toilet,
        total_meeting,
        total_consult,
        total_training,
        total_special_assign,
      } = item

      worksheetDatas.push({
        agent_name,
        employee_id,
        total_chat_handled,
        total_chat_handling_time: renderTimeFormat(total_chat_handling_time),
        total_no_response,
        avg_aht_per_chat: renderTimeFormat(avg_aht_per_chat),
        total_available: renderTimeFormat(total_available),
        total_awc: renderTimeFormat(total_awc),
        total_break: renderTimeFormat(total_break),
        total_toilet: renderTimeFormat(total_toilet),
        total_meeting: renderTimeFormat(total_meeting),
        total_consult: renderTimeFormat(total_consult),
        total_training: renderTimeFormat(total_training),
        total_special_assign: renderTimeFormat(total_special_assign),
      })
    })

    const worksheet = XLSX.utils.json_to_sheet(worksheetDatas, {
      skipHeader: true,
    })

    XLSX.utils.book_append_sheet(workbook, worksheet)

    const fileName = `AgentPerformance_report_${dayjs().format(
      "YYYYMMDD"
    )}_${dayjs().format("HHmm")}.xlsx`

    XLSX.writeFile(workbook, fileName)
  }

  const onConfirmExport = () => {
    Modal.confirm({
      title: "Confirm to Export",
      onOk: exportExcel,
      okButtonProps: {
        className:
          "!bg-main-orange hover:bg-gradient-to-r hover:from-main-orange hover:to-main-red",
      },
      cancelButtonProps: {
        className: "hover:!border-main-orange hover:!text-main-orange",
      },
    })
  }

  const onFinish = (value) => {
    setParams({
      keyword: value.keyword,
      date_start: dayjs(value.date[0]).format("YYYY-MM-DD HH:mm"),
      date_end: dayjs(value.date[1]).format("YYYY-MM-DD HH:mm"),
    })
  }

  const sorter = (a, b, field) => {
    if (a.time === "Total" || b.time === "Total") return 0
    return a[field] - b[field]
  }

  const columns = [
    {
      title: "Agent name",
      dataIndex: "agent_name",
      fixed: "left",
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      sorter: (a, b) => sorter(a, b, "employee_id"),
      align: "center",
    },
    {
      title: "Total Chat Handled",
      dataIndex: "total_chat_handled",
      sorter: (a, b) => sorter(a, b, "total_chat_handled"),
      align: "center",
    },
    {
      title: "Total Chat Handled Time",
      dataIndex: "total_chat_handling_time",
      sorter: (a, b) => sorter(a, b, "total_chat_handling_time"),
      align: "center",
      render: (total_chat_handling_time) =>
        renderTimeFormat(total_chat_handling_time),
    },
    {
      title: "Total Chat No Response",
      dataIndex: "total_no_response",
      sorter: (a, b) => sorter(a, b, "total_no_response"),
      align: "center",
    },
    {
      title: "AHT Per Chat",
      dataIndex: "avg_aht_per_chat",
      sorter: (a, b) => sorter(a, b, "avg_aht_per_chat"),
      align: "center",
      render: (avg_aht_per_chat) => renderTimeFormat(avg_aht_per_chat),
    },
    {
      title: "Available",
      dataIndex: "total_available",
      sorter: (a, b) => sorter(a, b, "total_available"),
      align: "center",
      render: (total_available) => renderTimeFormat(total_available),
    },
    {
      title: "ACW",
      dataIndex: "total_awc",
      sorter: (a, b) => sorter(a, b, "total_awc"),
      align: "center",
      render: (total_awc) => renderTimeFormat(total_awc),
    },
    {
      title: "Break",
      dataIndex: "total_break",
      sorter: (a, b) => sorter(a, b, "total_break"),
      align: "center",
      render: (total_break) => renderTimeFormat(total_break),
    },
    {
      title: "Toilet",
      dataIndex: "total_toilet",
      sorter: (a, b) => sorter(a, b, "total_toilet"),
      align: "center",
      render: (total_toilet) => renderTimeFormat(total_toilet),
    },
    {
      title: "Meeting",
      dataIndex: "total_meeting",
      sorter: (a, b) => sorter(a, b, "total_meeting"),
      align: "center",
      render: (total_meeting) => renderTimeFormat(total_meeting),
    },
    {
      title: "Consult",
      dataIndex: "total_consult",
      sorter: (a, b) => sorter(a, b, "total_consult"),
      align: "center",
      render: (total_consult) => renderTimeFormat(total_consult),
    },
    {
      title: "Training",
      dataIndex: "total_training",
      sorter: (a, b) => sorter(a, b, "total_training"),
      align: "center",
      render: (total_training) => renderTimeFormat(total_training),
    },
    {
      title: "Special Assign",
      dataIndex: "total_special_assign",
      sorter: (a, b) => sorter(a, b, "total_special_assign"),
      align: "center",
      render: (total_special_assign) => renderTimeFormat(total_special_assign),
    },
  ]

  return (
    <div className="h-full w-full  px-4 flex flex-col gap-6 mt-6">
      <h3 className="text-accent-grey text-2xl pb-2 font-semibold ">
        Agent Performance
      </h3>
      <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        autoComplete="off"
        onFinish={onFinish}
        initialValues={{
          date: [dayjs().startOf("day"), dayjs()],
          platform_id: "",
        }}
      >
        <Row justify="space-between">
          <Col>
            <Space>
              <Form.Item label="" name="keyword">
                <Input
                  placeholder="Search"
                  suffix={<SearchOutlined style={{ color: "#ccc" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Duration"
                name="date"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <RangePicker showTime size="large" />
              </Form.Item>
              {/* <Form.Item label="Date" name="duration">
                <DatePicker size="large" />
              </Form.Item>
              <Form.Item label="Time:" name="time">
                <TimePicker size="large" />
              </Form.Item> */}

              <Form.Item>
                <Button
                  _type="secondary"
                  _size="m"
                  className="w-[150px]"
                  htmlType="submit"
                >
                  Search
                </Button>
              </Form.Item>
            </Space>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Button
              _type="primary"
              className="w-[150px]"
              htmlType="submit"
              onClick={onConfirmExport}
            >
              Export
            </Button>
          </Col>
        </Row>
      </Form>
      <div className={cardClass}>
        <Table
          className=" w-[calc(100vw-310px)]"
          columns={columns}
          dataSource={data}
          scroll={{
            x: 2400,
          }}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

const cardClass = classNames(
  "bg-main-white border border-main-grey2",
  "py-4 px-3",
  "rounded-2xl"
)

export default AgentPerformance
