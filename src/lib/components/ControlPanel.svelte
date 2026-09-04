<script lang="ts">
	import { onMount } from 'svelte';
	import { Pane } from 'tweakpane';
	import { maskState } from '$lib/runes/maskState.svelte';

	let paneContainer = $state<HTMLDivElement>();

	type PanelSettings = {
		renderMode: 'material' | 'texture';
		scale: number;
		offsetX: number;
		offsetY: number;
		offsetZ: number;
		depthScale: number;
		color: string;
		opacity: number;
		metalness: number;
		roughness: number;
		clearcoat: number;
		clearcoatRoughness: number;
		ior: number;
		transmission: number;
		thickness: number;
		iridescence: number;
		iridescenceIOR: number;
		iridescenceThicknessMin: number;
		iridescenceThicknessMax: number;
		wireframe: boolean;
		flatShading: boolean;
		side: string;
	};

	type PaneBinding<Value> = {
		on(type: 'change', handler: (event: { value: Value }) => void): PaneBinding<Value>;
	};

	type TweakpaneFolder = {
		addBinding<Key extends keyof PanelSettings>(
			object: PanelSettings,
			key: Key,
			options?: Record<string, unknown>
		): PaneBinding<PanelSettings[Key]>;
		addFolder(options: { title: string; expanded?: boolean }): TweakpaneFolder;
	};

	onMount(() => {
		if (!paneContainer) return;

		const settings: PanelSettings = {
			renderMode: maskState.renderMode,
			scale: maskState.scale,
			offsetX: maskState.offsetX,
			offsetY: maskState.offsetY,
			offsetZ: maskState.offsetZ,
			depthScale: maskState.depthScale,
			color: maskState.color,
			opacity: maskState.opacity,
			metalness: maskState.metalness,
			roughness: maskState.roughness,
			clearcoat: maskState.clearcoat,
			clearcoatRoughness: maskState.clearcoatRoughness,
			ior: maskState.ior,
			transmission: maskState.transmission,
			thickness: maskState.thickness,
			iridescence: maskState.iridescence,
			iridescenceIOR: maskState.iridescenceIOR,
			iridescenceThicknessMin: maskState.iridescenceThicknessMin,
			iridescenceThicknessMax: maskState.iridescenceThicknessMax,
			wireframe: maskState.wireframe,
			flatShading: maskState.flatShading,
			side: maskState.side
		};

		const pane = new Pane({
			container: paneContainer,
			title: 'Mask',
			expanded: true
		}) as Pane & TweakpaneFolder;

		const bindState = <Key extends keyof PanelSettings>(
			folder: TweakpaneFolder,
			key: Key,
			options?: Record<string, unknown>
		) => {
			folder.addBinding(settings, key, options).on('change', (event) => {
				maskState[key] = event.value as never;
			});
		};

		bindState(pane, 'renderMode', {
			label: 'Mode',
			options: {
				Material: 'material',
				Texture: 'texture'
			}
		});

		const transform = pane.addFolder({ title: 'Transform', expanded: true });
		bindState(transform, 'scale', { label: 'Scale', min: 0.5, max: 2, step: 0.01 });
		bindState(transform, 'depthScale', { label: 'Depth', min: 0.2, max: 2.5, step: 0.01 });
		bindState(transform, 'offsetX', { label: 'Offset X', min: -1, max: 1, step: 0.001 });
		bindState(transform, 'offsetY', { label: 'Offset Y', min: -1, max: 1, step: 0.001 });
		bindState(transform, 'offsetZ', { label: 'Offset Z', min: -1, max: 1, step: 0.001 });

		const surface = pane.addFolder({ title: 'Surface', expanded: true });
		bindState(surface, 'color', { label: 'Base' });
		bindState(surface, 'opacity', { label: 'Opacity', min: 0, max: 1, step: 0.01 });
		bindState(surface, 'metalness', { label: 'Metal', min: 0, max: 1, step: 0.01 });
		bindState(surface, 'roughness', { label: 'Rough', min: 0, max: 1, step: 0.01 });

		const coat = pane.addFolder({ title: 'Coat / Glass', expanded: true });
		bindState(coat, 'clearcoat', { label: 'Clearcoat', min: 0, max: 1, step: 0.01 });
		bindState(coat, 'clearcoatRoughness', {
			label: 'Coat rough',
			min: 0,
			max: 1,
			step: 0.01
		});
		bindState(coat, 'ior', { label: 'IOR', min: 1, max: 2.33, step: 0.01 });
		bindState(coat, 'transmission', { label: 'Transmission', min: 0, max: 1, step: 0.01 });
		bindState(coat, 'thickness', { label: 'Thickness', min: 0, max: 2, step: 0.01 });

		const iridescence = pane.addFolder({ title: 'Iridescence', expanded: true });
		bindState(iridescence, 'iridescence', { label: 'Amount', min: 0, max: 1, step: 0.01 });
		bindState(iridescence, 'iridescenceIOR', { label: 'IOR', min: 1, max: 2.33, step: 0.01 });
		bindState(iridescence, 'iridescenceThicknessMin', {
			label: 'Thin',
			min: 0,
			max: 1200,
			step: 1
		});
		bindState(iridescence, 'iridescenceThicknessMax', {
			label: 'Thick',
			min: 0,
			max: 1200,
			step: 1
		});

		const render = pane.addFolder({ title: 'Render', expanded: false });
		bindState(render, 'side', {
			label: 'Side',
			options: {
				Front: 'front',
				Back: 'back',
				Double: 'double'
			}
		});
		bindState(render, 'wireframe', { label: 'Wireframe' });
		bindState(render, 'flatShading', { label: 'Flat shade' });

		return () => {
			pane.dispose();
		};
	});
</script>

<div
	class="fixed right-4 bottom-4 z-40 w-[min(320px,calc(100vw-2rem))] md:top-4 md:right-4 md:bottom-auto"
>
	<div bind:this={paneContainer} class="tweakpane-host"></div>
</div>
