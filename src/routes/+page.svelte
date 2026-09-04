<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { FaceLandmarkerService } from '$lib/runes/faceLandmarker.svelte';
	import StatusOverlay from '$lib/components/StatusOverlay.svelte';
	import Webcam from '$lib/components/Webcam.svelte';
	import Scene from '$lib/components/Scene.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';

	const faceService = new FaceLandmarkerService();

	let videoElement = $state<HTMLVideoElement>();
	let cameraReady = $state(false);
	let cameraError = $state<string | null>(null);

	onMount(async () => {
		await faceService.init();
	});

	onDestroy(() => {
		faceService.destroy();
	});

	function handleCameraReady() {
		cameraReady = true;
		if (videoElement) {
			faceService.startPrediction(videoElement);
		}
	}

	function handleCameraError(msg: string) {
		cameraError = msg;
	}

	let combinedError = $derived(faceService.error || cameraError);
	let loading = $derived(!faceService.modelLoaded || !cameraReady);
</script>

<div class="relative h-screen w-full overflow-hidden bg-black text-white antialiased">
	<div class="absolute inset-0 z-0">
		<Webcam bind:videoElement onCameraReady={handleCameraReady} onError={handleCameraError} />
		<Scene landmarkRef={faceService.landmarksRef} {videoElement} {cameraReady} />
	</div>

	<ControlPanel />
	<StatusOverlay {loading} error={combinedError} />
	<div class="absolute right-3 bottom-3 text-xs font-medium mix-blend-difference">
		<span>© 2026</span>
		<a
			class="underline-offset-2 transition-all duration-150 ease-out hover:underline"
			href="https://www.madebyhex.com/"
			target="_blank"
		>
			Marek Jóźwiak.
		</a>
		<span>Crafted with SvelteKit.</span>
	</div>
</div>
