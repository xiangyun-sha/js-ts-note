import * as Cesium from 'cesium';
import { useTemplateRef } from 'vue';

export function useCesiumContainer<P extends {}, E extends unknown>(
	props: P,
	emits: E,
) {
	const cesiumContainerRef = useTemplateRef('cesiumContainerRef');

	/**
	 * 初始化 Cesium viewer
	 * @param { string | El  } el
	 * @returns { void }
	 */
	function initCesiumViewer(el: string | Element): void {
		const viewer = new Cesium.Viewer(el, {
			shouldAnimate: true,
			animation: false,
			timeline: false,
			fullscreenButton: false,
			geocoder: false,
			homeButton: false,
			sceneModePicker: false,
			baseLayerPicker: false,
			navigationHelpButton: false,
		});

		viewer.creditDisplay.container.innerHTML = '';

		window._viewer = viewer;
	}

	return { cesiumContainerRef, initCesiumViewer };
}
