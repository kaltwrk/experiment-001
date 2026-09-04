export class MaskState {
	renderMode = $state<'material' | 'texture'>('material');

	scale = $state(1.2);
	offsetX = $state(0);
	offsetY = $state(0.0);
	offsetZ = $state(0.0);
	depthScale = $state(1.0);

	color = $state('#000000');
	opacity = $state(1.0);
	metalness = $state(0.0);
	roughness = $state(1.0);
	clearcoat = $state(0.5);
	clearcoatRoughness = $state(0.5);
	ior = $state(1.0);
	transmission = $state(0.0);
	thickness = $state(0.0);
	iridescence = $state(1.0);
	iridescenceIOR = $state(1.0);
	iridescenceThicknessMin = $state(160);
	iridescenceThicknessMax = $state(720);
	wireframe = $state(false);
	flatShading = $state(true);
	side = $state('double');
}

export const maskState = new MaskState();
