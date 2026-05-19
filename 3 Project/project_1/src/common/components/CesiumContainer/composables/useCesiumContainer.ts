import * as Cesium from 'cesium';
import { useTemplateRef } from 'vue';

export function useCesiumContainer<P extends {}, E extends unknown>(
	props: P,
	emits: E,
) {
	const cesiumContainerRef = useTemplateRef('cesiumContainerRef');

	Cesium.Ion.defaultAccessToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNThjOGI3OC00NzFhLTQ3ZGEtYTg2MS04MGViMjUxNjgyNGMiLCJpZCI6MjI0Mzk5LCJpYXQiOjE3MjA1MDkzMjZ9.cIpZHilEyWpXIOYfDAluR4MsHTVFLVaXqfgxv9w3MvM';

	/**
	 * 初始化 Cesium viewer
	 * @param { string | El  } el
	 * @returns { void }
	 */
	async function initCesiumViewer(el: string | Element): Promise<void> {
		const viewer = new Cesium.Viewer(el, {
			shouldAnimate: true,
			animation: false,
			timeline: false,
			fullscreenButton: false,
			geocoder: false,
			homeButton: true,
			sceneModePicker: false,
			baseLayerPicker: false,
			navigationHelpButton: false,
		});

		const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
			'http://172.3.3.181:8094/resources/dem/',
		);

		viewer.scene.terrainProvider = terrainProvider;

		viewer.creditDisplay.container.innerHTML = '';

		window._viewer = viewer;
	}

	return { cesiumContainerRef, initCesiumViewer };
}
