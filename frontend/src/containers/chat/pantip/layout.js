import Tag from "@/components/Tag"
import List from './list'
import Setting from "../setting"

const Layout = (props) => {
  return (
    <div className="flex flex-col">
      <div className="py-4 px-4 flex gap-[10px] border-main-grey3 border-b">
        <img
          className="w-12 h-12 object-cover rounded-full"
          src="/images/pantip-icon.png"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="typo-th-b2 text-accent-body-text">สนใจเครื่องกรองน้ำ coway หนีไปหรือคุ้มค่าครับ</span>
            <Tag text="new" />
          </div>
          <div className="typo-th-c3 text-accent-grey">โพสต์เมื่อ 30 นาทีที่ผ่านมา</div>
        </div>
      </div>
      <div className="grid grid-cols-[480fr_332fr] h-full">
        <List />
        <Setting pantip />
      </div>
    </div>
  )
}

export default Layout