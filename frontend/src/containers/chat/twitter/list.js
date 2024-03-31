// import { useEffect, useState } from 'react'
// import Tag from "@/components/Tag"
// import dayjs from "dayjs"
// import "dayjs/locale/th";
// import relativeTime from 'dayjs/plugin/relativeTime'
// import buddhistEra from "dayjs/plugin/buddhistEra";
// import { Input, Modal } from "antd"
// import axios from 'axios'
// import {
//   EyeInvisibleOutlined,
//   SendOutlined,
//   PictureOutlined,
// } from "@ant-design/icons"



import { EyeInvisibleOutlined, DeleteOutlined } from "@ant-design/icons"
import Button from "@/components/Button"

const List = () => {
  return (
    <div className="flex flex-col w-full h-full border-main-grey3 border-r">
      {/* list */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-scroll max-h-[calc(100vh-81px-87px)]">
        <div className="flex flex-col gap-1">
          <div className="typo-th-shl3 text-accent-body-text font-normal">สนใจเครื่องกรองน้ำ coway หนีไปหรือคุ้มค่าครับ</div>
          <div className="typo-th-c3 text-main-grey4 underline cursor-pointer">ดูโพสต์ต้นฉบับ</div>
        </div>
        <Button
          _type="primary"
          _size='s'
          className="w-fit typo-th-shl3"
        >
          ตอบกระทู้
        </Button>
      </div>
    </div>
  )
}

export default List