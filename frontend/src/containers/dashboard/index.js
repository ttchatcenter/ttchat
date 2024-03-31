import { useEffect, useState } from "react"
import { Row, Col, Spin } from "antd"
import RangePicker from "@/components/DateRangePicker"
import dayjs from "dayjs"
import { CalendarOutlined, LoadingOutlined } from "@ant-design/icons"
import TableAgentPerformance from "./TableAgentPerformance"
import useUser from "@/hooks/common/useUser"
import useListDashboardOverallPerformance from "@/hooks/report/useListDashboardOverallPerformance"
import useListAgentPerformance from "@/hooks/report/useListAgentPerformance"
import useTotalQueueWaiting from "@/hooks/report/useTotalQueueWaiting"
import useListMemberWithTimeInStatus from "@/hooks/report/useListMemberWithTimeInStatus"
import useTimeInStatus from "@/hooks/report/useTimeInStatus"

import useBrand from "@/hooks/common/useBrand"

const Dashboard = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [dateSelect, setDateSelect] = useState([
    dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    dayjs().format("YYYY-MM-DD HH:mm"),
  ])

  const { user } = useUser({
    redirectIfNotFound: "/login",
  })

  const { brand } = useBrand()

  const { data: overallData, refetch: refetchDashboardOverallPerformance } =
    useListDashboardOverallPerformance({
      brand_id: brand?.id,
      date_start: dateSelect[0],
      date_end: dateSelect[1],
      user_id: user?.role === "admin" ? user.id : undefined,
    })

  const { members, refetch: refetchMember } = useListMemberWithTimeInStatus({
    brand_id: brand?.id,
  })

  const { data: userTimeInStatus, refetch: refetchTimeInStatus } =
    useTimeInStatus({
      user_id: user?.id,
    })

  const {
    list: listAgentPerformance,
    refetch: refetchListAgentPerformance,
    isLoading,
    isFetching,
  } = useListAgentPerformance({
    brand_id: brand?.id,
    date_start: dateSelect[0],
    date_end: dateSelect[1],
  })

  useEffect(() => {
    if (!isFetching) {
      setLoading(false)
    }
  }, [isFetching])

  const { list: listTotalQueueWaiting, refetch: refetchListTotalQueueWaiting } =
    useTotalQueueWaiting({
      brand_id: brand?.id,
      date_start: dateSelect[0],
      date_end: dateSelect[1],
    })

  const agentData = {
    total_available: 0,
    avg_aht_per_chat: 0,
  }
  listAgentPerformance.forEach((item) => {
    if (user?.role === "admin") {
      if (item.agent_name === `${user.firstname} ${user.lastname}`) {
        agentData.total_available += Number(item.total_available)
        agentData.avg_aht_per_chat += Number(item.avg_aht_per_chat)
      }
    } else {
      agentData.total_available += Number(item.total_available)
      agentData.avg_aht_per_chat += Number(item.avg_aht_per_chat)
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetchListAgentPerformance()
      refetchMember()
      refetchDashboardOverallPerformance()
      refetchTimeInStatus()
      refetchListTotalQueueWaiting()
    }, 7000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const onChange = (date, dateString) => {
    setDateSelect([
      dayjs(dateString[0]).startOf("day").format("YYYY-MM-DD HH:mm"),
      dayjs(dateString[1] + " " + "23.59").format("YYYY-MM-DD HH:mm"),
    ])
    setOpen(false)
    setLoading(true)
  }

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

  const dateStart = new Date(dateSelect[0])
  const dateEnd = new Date(dateSelect[1])

  const getTimeInStatus = () => {
    if (userTimeInStatus) {
      return renderTimeFormat(userTimeInStatus?.time_in_status || 0)
    }
    return 0
  }

  const dataPerformance = [
    {
      icon: "/images/icon/no-response.png",
      title: "Total Chat  No Response",
      value: overallData?.total_no_response || 0,
    },
    {
      icon: "/images/icon/trophy.png",
      title: "Total Handled",
      value: overallData?.total_chat_handled || 0,
    },
    {
      icon: "/images/icon/clock.png",
      title: "Time in Status",
      value: getTimeInStatus(),
    },
    {
      icon: "/images/icon/box.png",
      title: "Total Chat Handled time",
      value: overallData?.total_chat_handling_time
        ? renderTimeFormat(overallData?.total_chat_handling_time)
        : 0,
    },
    {
      icon: "/images/icon/chat.png",
      title: "Avg. chat Handled time",
      value: overallData?.avg_chat_handling_time
        ? renderTimeFormat(overallData?.avg_chat_handling_time)
        : 0,
    },
    {
      icon: "/images/icon/chat.png",
      title: "Avg. chat response time",
      value: overallData?.avg_chat_response_time
        ? renderTimeFormat(overallData?.avg_chat_response_time)
        : 0,
    },
    {
      icon: "/images/icon/hourglass.png",
      title: "Avg. waiting time",
      value: overallData?.avg_waiting_time_in_queue
        ? renderTimeFormat(overallData?.avg_waiting_time_in_queue)
        : 0,
    },
    {
      icon: "/images/icon/head-phone.png",
      title: "AHT Per Chat",
      value: agentData?.avg_aht_per_chat
        ? renderTimeFormat(agentData?.avg_aht_per_chat)
        : 0,
    },
  ]

  const dataSocial = [
    {
      icon: "/images/icon/line.png",
      title: "LINE OA",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "line")?.total ||
        0,
    },
    {
      icon: "/images/icon/fb.png",
      title: "Facebook",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "facebook")
          ?.total || 0,
    },
    {
      icon: "/images/icon/fb-messenger.png",
      title: "Messenger",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "messenger")
          ?.total || 0,
    },
    {
      icon: "/images/icon/pantip.png",
      title: "Pantip",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "pantip")
          ?.total || 0,
    },
    {
      icon: "/images/icon/pantip-inbox.png",
      title: "Pantip Inbox",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "inbox")
          ?.total || 0,
    },
    {
      icon: "/images/icon/x.png",
      title: "Twitter",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "twitter")
          ?.total || 0,
    },
    {
      icon: "/images/icon/dm.png",
      title: "Twitter Dm",
      value:
        listTotalQueueWaiting?.find((item) => item.source === "dm")
          ?.total || 0,
    },
  ]

  const renderBoxPerformance = ({ icon, title, value }) => {
    return (
      <div className="border p-3 bg-white rounded h-[154px]">
        <Row align="middle" className="h-[60px]">
          <Col span={6}>
            <img className="w-[36px] " src={icon} />
          </Col>
          <Col span={18}>
            <span className="text-xl text-accent-grey">{title}</span>
          </Col>
        </Row>
        {Number(value) ? (
          <div className="text-[56px] text-[#F16624] text-center font-bold">
            {value}
          </div>
        ) : (
          <div className="text-[36px] text-[#F16624] text-center font-bold">
            {value}
          </div>
        )}
      </div>
    )
  }

  const renderBoxSocial = ({ icon, title, value }) => {
    return (
      <div className="border p-3 rounded-2xl h-[154px] bg-gradient-to-r from-[#f17d23CC] from-0% to-[#eb2328CC] to-100%">
        <div className="bg-[#F9C7A0] p-1.5 rounded-full w-12 h-12">
          <img className="w-full " src={icon} />
        </div>

        <div className="text-[36px] text-white text-right font-bold">
          {value}
        </div>
        <div className="text-xl text-white text-right">Queue: {title}</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-5">
      <Row justify="space-between">
        <Col>
          <div className="flex flex-row items-center text-accent-grey pb-5">
            <div className="text-4xl">
              {dayjs(dateStart).format("DD MMM YYYY")}
              {" - "}
              {dayjs(dateEnd).format("DD MMM YYYY")}
            </div>

            <div onClick={() => setOpen(true)} className="ml-5 cursor-pointer">
              <CalendarOutlined /> Select Date
            </div>
            <RangePicker
              open={open}
              onChange={onChange}
              allowClear={false}
              onOpenChange={(open) => setOpen(open)}
              className="invisible"
            />
          </div>
        </Col>
        <Col>
          <Spin
            spinning={loading && isFetching}
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          />
        </Col>
      </Row>
      <h3 className="text-accent-grey text-2xl pb-4 font-semibold">
        Overall Performance
      </h3>
      <Row gutter={[16, 16]} className="px-10">
        {dataPerformance.map((item) => (
          <Col key={item.title} span={6}>
            {renderBoxPerformance(item)}
          </Col>
        ))}
      </Row>

      <h3 className="text-accent-grey text-2xl pb-4 font-semibold mt-10">
        Queue waiting
      </h3>
      <Row gutter={[16, 16]} className="px-10">
        {dataSocial.map((item) => (
          <Col key={item.title} span={6}>
            {renderBoxSocial(item)}
          </Col>
        ))}
      </Row>

      {(user?.role === "super_admin" || user?.role === "supervisor") && (
        <TableAgentPerformance
          data={listAgentPerformance}
          brand={brand}
          members={members}
        />
      )}
    </div>
  )
}

export default Dashboard
