import { Button as AntButton } from 'antd'
import classNames from 'classnames'

const btnSize = {
  s: '!h-8',
  m: '!h-11',
  l: '!h-14',
}

const btnType = {
  primary: classNames(
    'bg-main-orange',
    'hover:bg-gradient-to-r',
    'hover:from-main-orange',
    'hover:to-main-red',
    '!text-main-white',
    '[&&&_*]:!text-main-white',
  ),
  secondary: classNames(
    'hover:bg-main-red',
    'hover:!border-main-red',
    'hover:!text-main-white',
    '[&&&_*]:hover:!text-main-white',
    '!text-main-orange',
    '[&&&_*]:!text-main-orange',
    '!border-main-orange',
  ),
}

const disabledBtnType = classNames(
  '!text-main-grey3',
  '[&&&_*]:!text-main-grey3',
  '[&&&]:border-main-grey3',
  '[&&&]:bg-main-grey2',
)

const Button = (props) => {
  const { _type, _size, className, ...rest } = props

  const buttonStyle = classNames(
    '!flex !gap-1 !items-center !justify-center',
    '!typo-b2 !px-6 !py-1 !rounded',
    btnSize[_size || 'm'],
    props.disabled ? disabledBtnType : btnType[_type],
    className,
  )

  return <AntButton className={buttonStyle} type={_type} {...rest} />
}

export default Button