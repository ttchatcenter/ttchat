import { useRouter } from "next/router"
import { CreateBrandFormWithModal } from "./CreateBrandForm"
import useListBrand from "@/hooks/brand/useListBrand"
import useUser from "@/hooks/common/useUser"
import config from "@/configs"

const BrandManagementPage = () => {
  const { push } = useRouter()
  const { brands, refetch } = useListBrand()

  const { user } = useUser({ redirectIfNotFound: '/login' })

  const handleSelectBrand = (id) => {
    window.localStorage.setItem(config.brandSessionKey, id)
    push('/dashboard')
  }

  return (
    <div className="h-full w-full py-14">
      <div className="w-full max-w-[1144px] m-auto flex flex-col gap-[50px]">
        <div className="relative text-center">
          <span className="typo-hl1 text-accent-grey">Select Brand</span>
          {
            user?.role === 'super_admin' || user?.role === 'supervisor' ? (
              <CreateBrandFormWithModal
              onSuccess={() => refetch()}
            />
            ) : undefined
          }
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-16 px-10">
          {
            brands.map(i => (
              <div
                key={i.id}
                className="w-full bg-main-white border rounded-2xl border-main-grey2 flex flex-col gap-3 px-3 py-4 cursor-pointer"
                onClick={() => handleSelectBrand(i.id)}
              >
                <div className="w-full border rounded-2xl border-main-grey2 flex items-center justify-center h-[187px] overflow-hidden">
                  <img src={i.logo} className="max-w-[144px] max-h-[144px]" />
                </div>
                <div>
                  <div className="typo-hl2 text-accent-grey">{i.name}</div>
                  <div className="typo-b4 text-main-grey4">{i.description}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default BrandManagementPage