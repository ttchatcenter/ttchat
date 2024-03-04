import classNames from "classnames"
import { Modal as AntModal } from "antd"
import Button from "@/components/Button"
import { CloseCircleFilled } from "@ant-design/icons"
import { CheckedCircle } from '@/components/Icons'

const Modal = ({
  type,
  title,
  description,
  buttonText,
  open,
  setOpen,
}) => {
  const handleSuccess = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <AntModal
      open={open}
      onCancel={handleCancel}
      closeIcon={false}
      footer={false}
      width={621}
      centered
      className={classNames(
        '[&_.ant-modal-content]:!px-10',
        '[&_.ant-modal-content]:!py-12',
        '[&_.ant-modal-content]:!rounded-2xl',
      )}
    >
      {
        type === 'success' ? (
          <CheckedCircle className="w-20 h-20 m-auto mb-[30px]" />
        ) : (
          <div className="w-full text-center">
            <CloseCircleFilled className="!text-main-red text-[80px] mb-[30px]" />
          </div>
        )
      }
      <h3 className="typo-hl1 text-center text-base-grey6 m-auto">{title}</h3>
      <h5 className="typo-th-shl3 text-center text-accent-grey pt-2 pb-12 m-auto">
        {description}
      </h5>
      <Button
        _type="primary"
        _size='l'
        className='w-full min-w-[480px]'
        onClick={handleSuccess}
      >
        {buttonText}
      </Button>
    </AntModal>
  )
}

export default Modal
