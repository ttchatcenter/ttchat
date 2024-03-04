import { CheckedCircle } from '@/components/Icons'

const PWD_VALIDATOR = [
  { text: 'มีความยาวอย่างน้อย 8 ตัวอักษร', validator: (v) => v?.length >= 8 },
  { text: 'มีตัวอักษรพิมพ์เล็กอย่างน้อยหนึ่งตัว', validator: (v) => v?.split('').some(i => 'abcdefghijklmnopqrstuvwxyz'.includes(i)) },
  { text: 'มีตัวอักษรพิมพ์ใหญ่อย่างน้อยหนึ่งตัว', validator: (v) => v?.split('').some(i => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(i)) },
  { text: 'มีตัวเลขอย่างน้อยหนึ่งตัว', validator: (v) => v?.split('').some(i => '0123456789'.includes(i)) },
  { text: 'มีอักขระพิเศษอย่างน้อยหนึ่งตัว เช่น !@#$^*-_=', validator: (v) => v?.split('').some(i => '!@#$^*-_='.includes(i)) },
]

const PasswordGuideBox = ({ password }) => {
  return (
    <div className="rounded-[4px] bg-main-grey1 p-3 flex flex-col gap-[4px] typo-th-d1">
      <div>รหัสผ่านจะต้องประกอบด้วย</div>
      {
        PWD_VALIDATOR.map((i) => {
          const validated = i.validator(password)
          return (
            <div key={i.text} className={`flex items-center ${validated ? 'text-main-grey3' : 'text-accent-grey'}`}>
              <div className="w-4 h-4 flex items-center justify-center">
                {
                  validated ? (
                    <CheckedCircle className="w-[8px] h-[8px]" />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-accent-grey" />
                  )
                }
              </div>
              <div>{i.text}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default PasswordGuideBox