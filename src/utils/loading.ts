
import { ElLoading } from 'element-plus'

export function showLoading(text = 'Loading...') {
  return ElLoading.service({
    lock: true,
    text,
    background: 'rgba(255, 255, 255, 0.8)',
  })
}

