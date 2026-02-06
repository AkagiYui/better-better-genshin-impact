import { message, Modal } from "ant-design-vue"

export const confirm = ({ title = "确认", content = "确认吗？", okText = "确定", cancelText = "取消", onOk = () => { } } = {}) => {
  Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    maskClosable: true,
    centered: true,
    onOk,
  })
}
