import { useEffect, useRef, useState } from 'react'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function UploadImageQuickReply({ value, onChange }) {
  const inputUploadRef = useRef(null)
  const [image, setImage] = useState(null)

  useEffect(() => {
    const handleFileChange = async () => {
      const data = { name: value.name, cover: value.cover }

      if (typeof value === 'string') {
        data.preview = value
      } else {
        data.preview = await getBase64(value)
      }

      setImage(data)
    }

    if (value) {
      handleFileChange()
    } else {
      setImage(null)
    }
  }, [value])

  const handleChange = (e) => {
    onChange(e.target.files[0])
    e.target.value = ''
  }

  async function handleRemoveImage() {
    onChange(null)
    setImage(null)
  }

  return (
    <>
      <div className="relative mt-6 h-[120px] w-[120px] rounded-lg border-2 border-dashed border-odk-grayscale4 bg-white">
        {
          image ? (
            <>
              <img className="h-full w-full object-cover" src={image?.preview} />
              <div role="button">
                <CloseOutlined
                  className="absolute -right-3 -top-3 rounded-full border border-odk-grayscale4 bg-white text-xl text-odk-error4"
                  onClick={() => handleRemoveImage()}
                />
              </div>
            </>
          ) : (
            <div
              role="button"
              onClick={() => inputUploadRef.current.click()}
              className="flex h-full flex-col items-center justify-center gap-1"
            >
              <PlusOutlined className="text-2xl text-accent-grey" />
              <span className="typo-th-b2 text-accent-grey">เพิ่มรูปภาพ</span>
            </div>
          )
        }
      </div>
      <input
        ref={inputUploadRef}
        id="upload"
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  )
}
