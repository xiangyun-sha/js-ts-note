import { h } from 'vue';
import { ElInput, ElInputNumber, ElSelect, ElOption, ElRadioGroup, ElRadio, ElSwitch, ElDatePicker } from 'element-plus';

export function useStandardField<P extends { field: RendererField }>(props: P) {}
