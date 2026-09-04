/**
 * Script to extract UV coordinates from MediaPipe canonical_face_model.obj
 *
 * The OBJ file has:
 * - 468 vertices (v lines)
 * - 468 texture coordinates (vt lines)
 * - Face definitions (f lines) with format: v_idx/vt_idx
 *
 * Run: node scripts/extract-uvs.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const objPath = join(__dirname, '../src/lib/assets/models/canonical_face_model.obj');
const outputPath = join(__dirname, '../src/lib/utils/FaceUVs.ts');

const objContent = readFileSync(objPath, 'utf-8');
const lines = objContent.split('\n');

const textureCoords = [];
const vertexToUV = new Map();

for (const line of lines) {
	const trimmed = line.trim();

	if (trimmed.startsWith('vt ')) {
		const parts = trimmed.split(/\s+/);
		const u = parseFloat(parts[1]);
		const v = parseFloat(parts[2]);
		textureCoords.push([u, v]);
	} else if (trimmed.startsWith('f ')) {
		const parts = trimmed.split(/\s+/).slice(1);

		for (const part of parts) {
			const indices = part.split('/');
			const vertexIdx = parseInt(indices[0]) - 1;
			const uvIdx = parseInt(indices[1]) - 1;

			if (!vertexToUV.has(vertexIdx)) {
				vertexToUV.set(vertexIdx, uvIdx);
			}
		}
	}
}

console.log(`Found ${textureCoords.length} texture coordinates`);
console.log(`Found ${vertexToUV.size} vertex->UV mappings`);

const VERTEX_COUNT = 468;
const uvArray = [];
for (let i = 0; i < VERTEX_COUNT; i++) {
	const uvIdx = vertexToUV.get(i);
	if (uvIdx !== undefined && textureCoords[uvIdx]) {
		const [u, v] = textureCoords[uvIdx];
		uvArray.push(u, 1.0 - v);
	} else {
		console.warn(`Warning: No UV found for vertex ${i}, using default (0.5, 0.5)`);
		uvArray.push(0.5, 0.5);
	}
}

const tsContent = `/**
 * Canonical UV coordinates for MediaPipe Face Mesh 468 landmarks.
 * Auto-generated from canonical_face_model.obj
 *
 * Each vertex has 2 values: [u, v] in range 0-1
 * Total: 468 vertices * 2 = 936 values
 */
export const FACE_MESH_UVS = new Float32Array([
${uvArray
	.map((val, i) => {
		const isU = i % 2 === 0;
		const vertexIdx = Math.floor(i / 2);
		if (isU) {
			return `\t// Vertex ${vertexIdx}\n\t${val.toFixed(6)},`;
		} else {
			return ` ${val.toFixed(6)},`;
		}
	})
	.join('')}
]);
`;

writeFileSync(outputPath, tsContent);
console.log(`\nGenerated ${outputPath}`);
console.log(`Total UV values: ${uvArray.length} (${uvArray.length / 2} vertices)`);
