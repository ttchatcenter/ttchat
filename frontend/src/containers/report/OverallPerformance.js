import { useState } from "react"
import classNames from "classnames"
import { Table, Form, Row, Col, Select, Space, DatePicker, Modal } from "antd"
import Button from "@/components/Button"
import * as XLSX from "xlsx"
import useListOverallPerformance from "@/hooks/report/useListOverallPerformance"
import useBrand from "@/hooks/common/useBrand"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import useListPlatform from "@/hooks/platform/useListPlatform"

dayjs.extend(duration)

const { RangePicker } = DatePicker

const initialTotal = {
  total_incoming_chat: 0,
  total_chat_handled: 0,
  total_no_response: 0,
  total_no_assigned: 0,
  total_abandon: 0,
  avg_chat_handling_time: 0,
  avg_chat_response_time: 0,
  avg_waiting_time_in_queue: 0,
  total_chat_rejected: 0,
  percent_sla: 0,
  percent_sla_messenger: 0,
  percent_sla_facebook: 0,
  percent_sla_line: 0,
  percent_sla_pantip: 0,
  percent_sla_pantip_inbox: 0,
  percent_sla_twitter: 0,
  percent_sla_dm: 0,
}

let currH = 0
const timeSlot = []
while (currH < 24) {
  const h = `0${currH}`.slice(-2)
  const nextH = `0${++currH}`.slice(-2)
  timeSlot.push(`${h}:01 - ${h}:30`)
  timeSlot.push(`${h}:31 - ${nextH == 24 ? "00" : nextH}:00`)
}

const OverallPerformance = () => {
  const [skip, setSkip] = useState(true)
  const [params, setParams] = useState({
    date_start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    date_end: dayjs().format("YYYY-MM-DD HH:mm"),
  })
  const { brand } = useBrand()

  const { platforms } = useListPlatform({
    brand_id: brand?.id,
  })

  const { list, timeStart, timeEnd } = useListOverallPerformance(
    {
      brand_id: brand?.id,
      ...params,
    },
    skip
  )

  const formatData = []

  const sumData = (items) => {
    const total = {
      ...initialTotal,
    }

    const count = {
      percent_sla: 0,
      percent_sla_messenger: 0,
      percent_sla_facebook: 0,
      percent_sla_line: 0,
      percent_sla_pantip: 0,
      percent_sla_pantip_inbox: 0,
      percent_sla_twitter: 0,
      percent_sla_dm: 0,
    }
    items.forEach((item) => {
      total.total_incoming_chat += Number(item.total_incoming_chat)
      total.total_chat_handled += Number(item.total_chat_handled)
      total.total_no_response += Number(item.total_no_response)
      total.total_no_assigned += Number(item.total_no_assigned)
      total.total_abandon += Number(item.total_abandon)
      total.avg_chat_handling_time += Number(item.avg_chat_handling_time)
      total.avg_chat_response_time += Number(item.avg_chat_response_time)
      total.avg_waiting_time_in_queue += Number(item.avg_waiting_time_in_queue)
      total.total_chat_rejected += Number(item.total_chat_rejected)
      total.percent_sla += Number(item.percent_sla)
      total.percent_sla_messenger += Number(item.percent_sla_messenger)
      total.percent_sla_facebook += Number(item.percent_sla_facebook)
      total.percent_sla_line += Number(item.percent_sla_line)
      total.percent_sla_pantip += Number(item.percent_sla_pantip)
      total.percent_sla_pantip_inbox += Number(item.percent_sla_pantip_inbox)
      total.percent_sla_twitter += Number(item.percent_sla_twitter)
      total.percent_sla_dm += Number(item.percent_sla_dm)

      if (Number(item.percent_sla) > 0) {
        count.percent_sla++
      }
      if (Number(item.percent_sla_messenger) > 0) {
        count.percent_sla_messenger++
      }
      if (Number(item.percent_sla_facebook) > 0) {
        count.percent_sla_facebook++
      }
      if (Number(item.percent_sla_line) > 0) {
        count.percent_sla_line++
      }
      if (Number(item.percent_sla_pantip) > 0) {
        count.percent_sla_pantip++
      }
      if (Number(item.percent_sla_pantip_inbox) > 0) {
        count.percent_sla_pantip_inbox++
      }
      if (Number(item.percent_sla_twitter) > 0) {
        count.percent_sla_twitter++
      }
      if (Number(item.percent_sla_dm) > 0) {
        count.percent_sla_dm++
      }

    })

    return {
      ...total,
      percent_sla: total.percent_sla / (count.percent_sla || 1),
      percent_sla_messenger:
        total.percent_sla_messenger / (count.percent_sla_messenger || 1),
      percent_sla_line: 
      total.percent_sla_line / (count.percent_sla_line || 1),
      percent_sla_pantip:
        total.percent_sla_pantip / (count.percent_sla_pantip || 1),
    }
  }

  const fillData = (originalData) => {
    const originalDataObj = {}
    originalData?.forEach((item) => {
      originalDataObj[item.time] = item
    })

    const filterTimeStart = dayjs(timeStart).format("HH:mm")
    const filterTimeEnd = dayjs(timeEnd).format("HH:mm")

    const isNotSameDate =
      dayjs(timeStart).format("YYYY-MM-DD") <
      dayjs(timeEnd).format("YYYY-MM-DD")
    const newData = []
    timeSlot?.forEach((time) => {
      const [start, end] = time.split(" - ")
      if (
        (dayjs(filterTimeStart, "HH:mm").diff(dayjs(start, "HH:mm")) < 0 &&
          dayjs(filterTimeEnd, "HH:mm").diff(dayjs(start, "HH:mm")) > 0) ||
        isNotSameDate
      ) {
        if (originalDataObj[time]) {
          newData.push(originalDataObj[time])
        } else {
          newData.push({ ...initialTotal, time })
        }
      }
    })

    return newData
  }

  Object.keys(list || {}).forEach((time) => {
    const items = list[time]
    formatData.push({
      time,
      ...sumData(items),
    })
  })

  const totalData = {
    time: "Total",
    ...sumData(formatData),
  }

  const data = [totalData, ...fillData(formatData)]

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0")
  }

  const sorter = (a, b, field) => {
    if (a.time === "Total" || b.time === "Total") return 0
    return a[field] - b[field]
  }

  const columns = [
    {
      title: "",
      dataIndex: "time",
      fixed: "left",
      align: "center",
    },
    {
      title: "Total Incoming Chat",
      dataIndex: "total_incoming_chat",
      sorter: (a, b) => sorter(a, b, "total_incoming_chat"),
      align: "center",
    },
    {
      title: "Total Chat Handled",
      dataIndex: "total_chat_handled",
      sorter: (a, b) => sorter(a, b, "total_chat_handled"),
      align: "center",
    },
    {
      title: "Total Chat No response",
      dataIndex: "total_no_response",
      sorter: (a, b) => sorter(a, b, "total_no_response"),
      align: "center",
    },
    {
      title: "Total Chat No Assigned",
      dataIndex: "total_no_assigned",
      sorter: (a, b) => sorter(a, b, "total_no_assigned"),
      align: "center",
    },
    {
      title: "Total Chat Abandon",
      dataIndex: "total_abandon",
      sorter: (a, b) => sorter(a, b, "total_abandon"),
      align: "center",
    },
    {
      title: "Avg. Chat Handling time",
      dataIndex: "avg_chat_handling_time",
      sorter: (a, b) => sorter(a, b, "avg_chat_handling_time"),
      align: "center",
      render: (avg_chat_handling_time) =>
        renderTimeFormat(avg_chat_handling_time),
    },
    {
      title: "Avg. Chat Response time",
      dataIndex: "avg_chat_response_time",
      sorter: (a, b) => sorter(a, b, "avg_chat_response_time"),
      align: "center",
      render: (avg_chat_response_time) =>
        renderTimeFormat(avg_chat_response_time),
    },
    {
      title: "Avg. Waiting time in queue",
      dataIndex: "avg_waiting_time_in_queue",
      sorter: (a, b) => sorter(a, b, "avg_waiting_time_in_queue"),
      align: "center",
      render: (avg_waiting_time_in_queue) =>
        renderTimeFormat(avg_waiting_time_in_queue),
    },
    {
      title: "Total Chat Rejected",
      dataIndex: "total_chat_rejected",
      sorter: (a, b) => sorter(a, b, "total_chat_rejected"),
      align: "center",
    },
    {
      title: "% SLA",
      dataIndex: "percent_sla",
      sorter: (a, b) => sorter(a, b, "percent_sla"),
      align: "center",
      render: (text) => text || 0,
    },
    {
      title: "% SLA by Channel Line OA",
      dataIndex: "percent_sla_line",
      sorter: (a, b) => sorter(a, b, "percent_sla_line"),
      align: "center",
      render: (text) => text || 0,
    },
    {
      title: "% SLA by Channel Facebook",
      dataIndex: "percent_sla_facebook",
      sorter: (a, b) => sorter(a, b, "percent_sla_facebook"),
      align: "center",
      render: (text) => text || 0,
    },
    {
      title: "% SLA by Channel Messenger",
      dataIndex: "percent_sla_messenger",
      sorter: (a, b) => sorter(a, b, "percent_sla_messenger"),
      align: "center",
      render: (text) => text || 0,
    },
    {
      title: "% SLA by Channel Pantip",
      dataIndex: "percent_sla_pantip",
      sorter: (a, b) => sorter(a, b, "percent_sla_pantip"),
      align: "center",
      render: (text) => text || 0,
    },
  ]

  const onFinish = (value) => {
    setSkip(false)
    setParams({
      platform_id: value.platform_id,
      date_start: dayjs(value.date[0]).format("YYYY-MM-DD HH:mm"),
      date_end: dayjs(value.date[1]).format("YYYY-MM-DD HH:mm"),
    })
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
      time: "เวลา",
      total_incoming_chat: "Total Incoming Chat",
      total_chat_handled: "Total Chat Handled",
      total_no_response: "Total Chat No response",
      total_no_assigned: "Total Chat No Assigned",
      total_abandon: "Total Chat Abandon",
      avg_chat_handling_time: "Avg. Chat Handling time",
      avg_chat_response_time: "Avg. Chat Response time",
      avg_waiting_time_in_queue: "Avg. Waiting time in queue",
      total_chat_rejected: "Total Chat Rejected",
      percent_sla: "% SLA",
      percent_sla_line: "% SLA by Channel Line OA",
      percent_sla_facebook: "% SLA by Channel Facebook",
      percent_sla_messenger: "% SLA by Channel Messenger",
      percent_sla_pantip: "% SLA by Channel Pantip",
    }

    worksheetDatas.push(headerColumn)

    data.forEach((item) => {
      let {
        time,
        total_incoming_chat,
        total_chat_handled,
        total_no_response,
        total_no_assigned,
        total_abandon,
        avg_chat_handling_time,
        avg_chat_response_time,
        avg_waiting_time_in_queue,
        total_chat_rejected,
        percent_sla,
        percent_sla_line,
        percent_sla_facebook,
        percent_sla_messenger,
        percent_sla_pantip,
      } = item

      worksheetDatas.push({
        time,
        total_incoming_chat,
        total_chat_handled,
        total_no_response,
        total_no_assigned,
        total_abandon,
        avg_chat_handling_time: renderTimeFormat(avg_chat_handling_time),
        avg_chat_response_time: renderTimeFormat(avg_chat_response_time),
        avg_waiting_time_in_queue: renderTimeFormat(avg_waiting_time_in_queue),
        total_chat_rejected,
        percent_sla,
        percent_sla_line,
        percent_sla_facebook,
        percent_sla_messenger,
        percent_sla_pantip,
      })
    })

    const worksheet = XLSX.utils.json_to_sheet(worksheetDatas, {
      skipHeader: true,
    })

    XLSX.utils.book_append_sheet(workbook, worksheet)

    const fileName = `OverallPerformance_report_${dayjs().format(
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

  return (
    <div className="h-full w-full  px-4 flex flex-col gap-6 mt-6">
      <h3 className="text-accent-grey text-2xl pb-2 font-semibold ">
        Overall Performance
      </h3>
      <Form
        name="basic"
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
              <Form.Item label="Channel" name="platform_id" className="w-80">
                <Select
                  size="large"
                  options={[
                    {
                      value: "",
                      label: "All",
                    },
                    ...platforms?.map((item) => ({
                      value: item.id,
                      label: `${item.name} (${item.type})`,
                    })),
                  ]}
                />
              </Form.Item>

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
          pagination={false}
          rowClassName={(record, index) => index === 0 && "bg-[#FCE0CA]"}
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

export default OverallPerformance
