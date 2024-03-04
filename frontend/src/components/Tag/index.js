import classNames from "classnames"
import { firstLetterUpperCase } from "@/utils"

const tagColor = {
  orange: '[&&&]:text-tag-orange bg-tag-orange-bg border-tag-orange',
  blue: '[&&&]:text-tag-blue bg-tag-blue-bg border-tag-blue',
  purple: '[&&&]:text-tag-purple bg-tag-purple-bg border-tag-purple',
  green: '[&&&]:text-tag-green bg-tag-green-bg border-tag-green',
  red: '[&&&]:text-tag-red bg-tag-red-bg border-tag-red',
  brown: '[&&&]:text-tag-brown bg-tag-brown-bg border-tag-brown',
  yellow: '[&&&]:text-[#C98B31] bg-[#FEFBE8] border-[#C98B31]',
}

const mapStatusToColor = {
  new: 'orange',
  assigned: 'blue',
  replied: 'purple',
  closed: 'green',
  rejected: 'red',
  transfer: 'brown',
  active: 'green',
  inactive: 'red',
}

const size = {
  sm: '',
  md: 'px-4 py-0.5',
}

export const Tag = (props) => {
  const { color, text, customClasses } = props
  const tagClass = classNames(
    'px-4 py-0.5 rounded w-fit border',
    tagColor[mapStatusToColor[text] || color],
    customClasses,
  )
  return (
    <div className={tagClass} onClick={() => props.onClick?.()}>{firstLetterUpperCase(text)}</div>
  )
}

export default Tag