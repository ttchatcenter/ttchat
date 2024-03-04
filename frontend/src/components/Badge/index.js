import classNames from "classnames"
import { MinusCircleFilled } from "@ant-design/icons"

const Badge = ({ color, customClasses, minus = false }) => {
  const badgeClass = classNames(
    'flex items-center justify-center',
    'rounded-full w-3 h-3',
    color,
    customClasses,
  )

  if (minus) {
    return <MinusCircleFilled className={`w-3 h-3 ${color} ${customClasses}`} />
  }

  return (
    <div className={badgeClass} />
  )
}

export default Badge