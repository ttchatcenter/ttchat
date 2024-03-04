import { forwardRef } from "react"
import { DatePicker } from "antd"
import dayjs from "dayjs"

import { css } from "@/utils"

const { RangePicker: AntdRangePicker } = DatePicker

const component =   ({ className, popupClassName, size = 2, ...props }, ref) => {
  const ranges = {
    // ตั้งแต่เปิดร้าน: [dayjs("2023-01-01"), dayjs()],
    วันนี้: [dayjs(), dayjs()],
    เมื่อวานนี้: [dayjs().add(-1, "d"), dayjs().add(-1, "d")],
    "7 วันล่าสุด": [dayjs().add(-7, "d"), dayjs()],
    "14 วันล่าสุด": [dayjs().add(-14, "d"), dayjs()],
    "30 วันล่าสุด": [dayjs().add(-30, "d"), dayjs()],
    อาทิตย์นี้: [dayjs().startOf("w"), dayjs()],
    อาทิตย์ที่แล้ว: [
      dayjs().add(-1, "w").startOf("w"),
      dayjs().add(-1, "w").endOf("w"),
    ],
    เดือนนี้: [dayjs().startOf("M"), dayjs().endOf("M")],
    เดือนที่แล้ว: [
      dayjs().add(-1, "M").startOf("M"),
      dayjs().add(-1, "M").endOf("M"),
    ],
  }

  const disabledDate = (current) => current > new Date()

  size = {
    1: "h-[36px]",
    2: "h-[40px]",
    3: "h-[44px]",
  }[size]

  return (
    <AntdRangePicker
      ranges={ranges}
      disabledDate={disabledDate}
      className={css("rounded-[4px]", size, className)}
      popupClassName={css(
        "[&_.ant-picker-preset_>_span]:!text-odk-primary6",
        popupClassName
      )}
      {...props}
    />
  )
}
const DateRangePicker = forwardRef(component)

export default DateRangePicker
