import { h } from 'vue';
import type { RenderFunction } from 'vue';

export function useUploadField<
	P extends {
		field: RendererField;
		formData: Record<string, any>;
		onupdate: <R extends RendererField, E extends any>(
			field: R,
			value: E,
		) => void;
		onchange: <R extends RendererField, E extends any>(
			field: R,
			value: E,
		) => void;
	},
>(props: P): RenderFunction {
	return () => {};
}
