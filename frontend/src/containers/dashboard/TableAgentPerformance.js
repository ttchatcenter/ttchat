import classNames from "classnames"
import { Badge, Table } from "antd"

const statusMapper = {
  available: { color: "#88C941" },
  idle: { color: "#565656" },
  awc: { color: "#EB2328" },
  break: { color: "#F17D23" },
  toilet: { color: "#EB2328" },
  meeting: { color: "#EB2328" },
  consult: { color: "#EB2328" },
  traning: { color: "#EB2328" },
  special_assign: { color: "#EB2328" },
}

const TableAgentPerformance = ({ data, brand, members }) => {
  let concurrent = {}
  let timeInStatus = {}
  members?.forEach((item) => {
    const totalConcurrent =
      item.concurrent_1 +
      item.concurrent_2 +
      item.concurrent_3 +
      item.concurrent_4 +
      item.concurrent_5

    const totalCurrentTicket =
      item.current_ticket_1 +
      item.current_ticket_2 +
      item.current_ticket_3 +
      item.current_ticket_4 +
      item.current_ticket_5

    const diff = totalConcurrent - totalCurrentTicket
    concurrent[`${item?.firstname} ${item?.lastname}`] = diff < 0 ? 0 : diff

    timeInStatus[`${item?.firstname} ${item?.lastname}`] = item.time_in_status
  })

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0")
  }

  const renderTimeFormat = (minute) => {
    const totalSeconds = minute * 60
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`
  }

  const columns = [
    {
      title: "Agent name",
      dataIndex: "agent_name",
      sorter: (a, b) => a.agent_name?.localeCompare(b.agent_name),
    },
    {
      title: "Status",
      dataIndex: "badge_status",
      sorter: (a, b) =>
        (a.badge_status || "idle")?.localeCompare(b.badge_status || "idle"),
      render: (status) => (
        <div className="w-[100px]">
          <Badge
            color={statusMapper[status || "idle"]?.color}
            text={status || "idle"}
          />
        </div>
      ),
    },
    {
      title: "Time in Status",
      dataIndex: "timeInStatus",
      sorter: (a, b) => timeInStatus[a.agent_name] - timeInStatus[b.agent_name],
      align: "center",
      render: (_, record) => renderTimeFormat(timeInStatus[record.agent_name]),
    },
    {
      title: "Available concurrent",
      dataIndex: "availableConcurrent",
      sorter: (a, b) => concurrent[a.agent_name] - concurrent[b.agent_name],
      align: "center",
      render: (_, record) => concurrent[record.agent_name],
    },
    {
      title: "Total Chat  Handled Time",
      dataIndex: "total_chat_handling_time",
      sorter: (a, b) => a.total_chat_handling_time - b.total_chat_handling_time,
      align: "center",
      render: (total_chat_handling_time) =>
        renderTimeFormat(total_chat_handling_time),
    },
    {
      title: "Total Chat No response",
      dataIndex: "total_no_response",
      sorter: (a, b) => a.total_no_response - b.total_no_response,
      align: "center",
    },
    {
      title: "AHT Per Chat",
      dataIndex: "avg_aht_per_chat",
      sorter: (a, b) => a.avg_aht_per_chat - b.avg_aht_per_chat,
      align: "center",
      render: (avg_aht_per_chat) => renderTimeFormat(avg_aht_per_chat),
    },
  ]

  return (
    <div>
      <h3 className="text-accent-grey text-2xl pb-4 font-semibold mt-10">
        Agent performance
      </h3>
      <div className={cardClass}>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

const cardClass = classNames(
  "bg-main-white border border-main-grey2",
  "py-4 px-3",
  "rounded-2xl",
  "mx-auto",
  "w-full",
  "flex flex-col gap-8"
)

export default TableAgentPerformance
