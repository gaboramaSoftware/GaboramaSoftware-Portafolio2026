import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/Addons.js';

export function loadSunModel(targetGroup: THREE.Group): Promise<void> {
    console.log("Corrigiendo el desfase del eje Z...");
    
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            'assets/sol_portafolio.glb', 
            (gltf : GLTF) => {
                const rawModel = gltf.scene;

                rawModel.traverse((node: THREE.Object3D) => {
                    if (node instanceof THREE.Mesh) {
                        node.material = new THREE.MeshStandardMaterial({
                            color: 0xf8f8f8, 
                            roughness: 0.5,  
                            metalness: 0.4,  
                            flatShading: true 
                        });
                    }
                });

                // 1. Calculamos el centro de masa real (incluyendo el problemático eje Z)
                const box = new THREE.Box3().setFromObject(rawModel);
                const center = new THREE.Vector3();
                box.getCenter(center);

                rawModel.position.set(-center.x, -center.y, -center.z);
                const localWrapper = new THREE.Group();
                localWrapper.add(rawModel);
                localWrapper.scale.set(8, 8, 8); 
                targetGroup.add(localWrapper);

                console.log("¡Eje Z corregido y escalado uniforme aplicado con éxito!");
                resolve();
            }, 
            undefined,
            (error: unknown) => {
                console.error("Error en GLTFLoader:", error);
                reject(error);
            }
        );
    });
}