import List from './list'
import Setting from "../setting"

const Layout = ({ data, setSelected }) => {
  return (
    <div className="grid grid-cols-[480fr_332fr] h-full">
      <List data={data} />
      <Setting data={data} setSelected={setSelected} />
    </div>
  )
}

export default Layout