import * as THREE from 'three';

interface EngineController {
    sunPivot: THREE.Group;
    updateSection: (index: number, total: number) => void;
    resize: () => void;
    destroy: () => void;
    setAppearance: (scale: number, xOffset: number, yOffset: number) => void;
}

export function createEngine(container: HTMLElement): EngineController {
    // Al inicio de createEngine:
    let initialFov = 40;
    if (window.innerWidth <= 480) initialFov = 15;
    else if (window.innerWidth <= 900) initialFov = 22;
    else if (window.innerWidth <= 1200) initialFov = 30;
    
    if (typeof window === 'undefined') {
        return {} as EngineController;
    }

    const scene = new THREE.Scene();
    
    // Usamos el tamaño real del contenedor HTML en lugar del tamaño global de la pantalla
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setClearColor(0x000000, 0); 
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const sunPivot = new THREE.Group();
    scene.add(sunPivot);
    
    // Seteamos una escala e inicialización limpia (0,0,0).
    sunPivot.scale.set(1, 1, 1);
    sunPivot.position.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xf8f8f8, 1.5));
    const dirLight = new THREE.DirectionalLight(0xf9f9f9, 2);
    dirLight.position.set(100, 100, 100);
    scene.add(dirLight);

    // --- VARIABLES DE INTERACCIÓN ---
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rotationVelocity = { y: 0, z: 0 };
    const DAMPING = 0.95; 
    const SENSITIVITY = 0.005;

    function onPointerDown(e: MouseEvent | TouchEvent) {
        if ('touches' in e && e.touches.length > 1) return; 
        isDragging = true;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        lastMouseX = clientX;
        lastMouseY = clientY;
    }

    function onPointerMove(e: MouseEvent | TouchEvent) {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - lastMouseX;
        const deltaY = clientY - lastMouseY;

        rotationVelocity.y += deltaX * SENSITIVITY;
        rotationVelocity.z += deltaY * SENSITIVITY;

        lastMouseX = clientX;
        lastMouseY = clientY;
    }

    function onPointerUp() { isDragging = false; }

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let animationId: number;
    
    // Posición inicial inteligente del eje Z para la cámara
    camera.position.set(0, 0, window.innerWidth < 900 ? 3.8 : 5);

    function tick() {
        animationId = requestAnimationFrame(tick);
        
        // Rotación directa sobre el pivote local
        sunPivot.rotation.y += rotationVelocity.y;
        sunPivot.rotation.z += rotationVelocity.z;

        if (!isDragging) {
            sunPivot.rotation.y += 0.005; 
        }

        rotationVelocity.y *= DAMPING;
        rotationVelocity.z *= DAMPING;
        
        // La cámara siempre se clava mirando al origen del Sol
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    tick();

    return {
        sunPivot,
        updateSection: (index: number, total: number) => {},
        
        resize: () => {
            const w = container.clientWidth;            
            const h = window.innerWidth < 900 ? w : container.clientHeight;
            if (w < 50) return;
            
            // 1. Calculamos el FOV ideal de forma pragmática para cada breakpoint
            let dynamicFov = 40;
            
            if (window.innerWidth <= 480) {
                dynamicFov = 85;  
            } else if (window.innerWidth <= 900) {
                dynamicFov = 80;  
            } else if (window.innerWidth <= 1200) {
                dynamicFov = 60;  
            }

            // 2. Le asignamos el nuevo lente óptico a la cámara
            camera.fov = dynamicFov;
            
            // 3. Re-calculamos el aspecto y actualizamos el motor
            camera.aspect = w / h;
            camera.updateProjectionMatrix(); // ¡CRÍTICO! Esto le avisa a Three.js que el FOV cambió
            
            renderer.setSize(w, h);
        },
        
        // ¡AQUÍ ESTABA EL GRAN ERROR RESPONSIVO! 
        // Interceptamos los valores cuando la pantalla baja de 900px
        setAppearance: (scale: number, xOffset: number, yOffset: number) => {
            if (window.innerWidth < 900) {
                // En móviles e intermedios anulamos los offsets externos que lo desvían.
                // Lo clavamos simétrico en el centro de su contenedor rojo.
                sunPivot.position.set(0, 0, 0);
                
                // Forzamos una escala de apariencia saludable (grande) dentro del canvas chico
                sunPivot.scale.set(1.4, 1.4, 1.4);
            } else {
                // En pantallas grandes de escritorio, respetamos el comportamiento original
                sunPivot.position.x = xOffset;
                sunPivot.position.y = yOffset || 0;
                sunPivot.position.z = 0;
                sunPivot.scale.set(scale, scale, scale);
            }
        },
        
        destroy: () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            window.removeEventListener('mousedown', onPointerDown);
            window.removeEventListener('mousemove', onPointerMove);
            window.removeEventListener('mouseup', onPointerUp);
            window.removeEventListener('touchstart', onPointerDown);
            window.removeEventListener('touchmove', onPointerMove);
            window.removeEventListener('touchend', onPointerUp);
        },
    };
}