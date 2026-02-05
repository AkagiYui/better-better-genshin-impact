<template>
  <a-modal
    :open="visible"
    title="🌸 选择启动的一条龙 🌸"
    :confirm-loading="loading"
    ok-text="启动"
    cancel-text="取消"
    class="anime-modal"
    centered
    @ok="handleOk"
    @update:open="handleVisibleChange">
    <div style="padding: 20px 0;">
      <a-select v-model:value="selectedValue" style="width: 100%" placeholder="请选择配置">
        <a-select-option v-for="item in options" :key="item" :value="item">
          {{ item }}
        </a-select-option>
      </a-select>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch } from "vue"
import { message } from "ant-design-vue"
import { getOneLongAllName, startOneLong } from "@/api"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:visible"])

const loading = ref(false)
const options = ref([])
const selectedValue = ref("")

const handleVisibleChange = (val) => {
  emit("update:visible", val)
}

const loadOptions = async () => {
  try {
    loading.value = true
    const res = await getOneLongAllName()
    options.value = res?.data?.data || []
    if (options.value.length) {
      selectedValue.value = options.value[0]
    } else {
      selectedValue.value = ""
    }
  } catch (e) {
    message.error("加载列表失败")
  } finally {
    loading.value = false
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      loadOptions()
    }
  },
)

const handleOk = async () => {
  if (!selectedValue.value) return
  try {
    loading.value = true
    await startOneLong(selectedValue.value)
    message.success(`启动 ${selectedValue.value}`)
    emit("update:visible", false)
  } catch (e) {
    message.error("启动失败")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 模态框美化 */
.anime-modal :deep(.ant-modal-content) {
  border-radius: 20px;
  border: 3px solid #ffcce6;
  background: #fff0f5;
}

.anime-modal :deep(.ant-modal-header) {
  background: transparent;
  border-bottom: 2px dashed #ffb6c1;
}

.anime-modal :deep(.ant-modal-title) {
  color: #ff3385;
  text-align: center;
}
</style>
