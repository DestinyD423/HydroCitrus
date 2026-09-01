import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import * as THREE from 'three';

function Model() {
    const { scene } = useGLTF('/models/pot.glb');
    
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.visible = true;
                child.material.side = THREE.DoubleSide;
                child.material.transparent = false; 
                child.material.opacity = 1.0;       
                if (child.name.toLowerCase().includes('box') || child.name.toLowerCase().includes('shape')) {
                    child.material.color = new THREE.Color('#ef4444'); 
                }
            }
        });
    }, [scene]);

    return <primitive object={scene} scale={6.0} position={[0, -1.2, 0]} />;
}

export default function Pot3D() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center w-full h-[550px]">
            <div className="text-left w-full mb-3">
                <h3 className="font-black text-gray-700 uppercase text-xs tracking-widest">
                    Uji Diagnostik Model 3D
                </h3>
                <p className="text-[10px] text-gray-400 font-bold">Mencari komponen yang hilang...</p>
            </div>
            
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative">
                <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">Loading...</div>}>
                    <Canvas camera={{ position: [3.5, 3.5, 3.5], fov: 40 }}>
                        <ambientLight intensity={1.5} /> 
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <Center>
                            <Model />
                        </Center>
                        <OrbitControls enableZoom={true} minDistance={0.5} maxDistance={8} enablePan={false} />
                    </Canvas>
                </Suspense>
            </div>
        </div>
    );
}