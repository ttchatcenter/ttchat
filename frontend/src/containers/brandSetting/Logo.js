import classNames from "classnames"
import { EditOutlined } from "@ant-design/icons"
import useBrand from "@/hooks/common/useBrand"
import useUpdateBrandLogo from "@/hooks/brand/useUpdateBrandLogo"

const Logo = () => {
  const { brand, refetch } = useBrand()

  const { updateBrandLogo } = useUpdateBrandLogo({
    onSuccess: () => {
      refetch()
      document.getElementById('upload').value = ''
    },
  })

  const handleClickEdit = () => {
    document.getElementById('upload').click()
  }

  const handleFileChange = (e) => {
    updateBrandLogo(brand?.id, { logo: e.target.files?.[0] })
  }

  return (
    <div className={logoClass}>
      <img
        src={brand?.logo}
        className="w-full h-full object-cover"
      />
      <div className={logoHoverClass}>
        <EditOutlined
          className="!text-main-white mb-[10px] text-2xl cursor-pointer"
          onClick={handleClickEdit}
        />
      </div>
      <input
        type="file"
        id="upload"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

const logoClass = classNames(
  'group',
  'w-[100px] h-[100px]',
  'relative',
  'flex items-center justify-center',
  'rounded-full',
  'bg-main-grey4',
  'mx-auto',
  'overflow-hidden',
)

const logoHoverClass = classNames(
  'hidden group-hover:flex',
  'items-end justify-center',
  'w-[100px] h-[100px]',
  'absolute inset-0',
  'bg-[rgba(0,_0,_0,_50%)]',
  'rounded-full',
)

export default Logo