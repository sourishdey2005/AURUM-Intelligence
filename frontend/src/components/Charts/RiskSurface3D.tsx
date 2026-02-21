import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Text, Stars, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const VolatilitySurface = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const rowCount = 40;
    const colCount = 40;

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(12, 12, rowCount - 1, colCount - 1);
        geo.rotateX(-Math.PI / 2);
        return geo;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        const positions = meshRef.current.geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Advanced Volatility Surface Waveform
            const y = (
                Math.sin(x * 0.4 + time) * 0.6 +
                Math.cos(z * 0.5 + time * 0.7) * 0.3 +
                Math.sin(Math.sqrt(x * x + z * z) * 0.4 - time * 1.5) * 0.3
            );

            positions.setY(i, y);
        }
        positions.needsUpdate = true;
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                color="#FFD700"
                wireframe
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
                emissive="#FFD700"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

const Infrastructure3D = () => {
    return (
        <group position={[0, -3, 0]}>
            {/* Base Plate */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#050505" roughness={1} metalness={0} />
            </mesh>

            {/* Grid Box (The "Cube" structure) */}
            <gridHelper args={[14, 14, "#FFD700", "#1e293b"]} position={[0, 0.01, 0]} />

            {/* Outer Glass Box */}
            <mesh position={[0, 3, 0]}>
                <boxGeometry args={[14.2, 6, 14.2]} />
                <meshStandardMaterial
                    color="#FFD700"
                    wireframe
                    transparent
                    opacity={0.03}
                />
            </mesh>

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text position={[8, 0, 0]} fontSize={0.5} color="#FFD700" rotation={[0, -Math.PI / 2, 0]}>STRIKE_PRC</Text>
                <Text position={[0, 0, 8]} fontSize={0.5} color="#FFD700">EXPIRY_T</Text>
                <Text position={[-8, 4, 0]} fontSize={0.5} color="#FFD700" rotation={[0, Math.PI / 2, 0]}>VOLATILITY_%</Text>
            </Float>
        </group>
    );
};

export const RiskSurface3D = () => {
    return (
        <div className="h-full w-full bg-black rounded-[40px] overflow-hidden relative border border-white/5 shadow-2xl">
            {/* UI Overlays */}
            <div className="absolute top-8 left-10 z-10 pointer-events-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-aurum-gold rounded-full shadow-[0_0_15px_#FFD700] animate-pulse"></div>
                    <span className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Risk_Tensor_Active</span>
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SVI <span className="text-aurum-gold">Advanced</span> Surface</h3>
                <p className="text-[9px] font-mono text-slate-500 mt-2 uppercase tracking-widest">Latent Volatility Mapping :: Core_Node_7</p>
            </div>

            <div className="absolute bottom-10 right-10 z-10 flex gap-4">
                <div className="glass-card px-6 py-3 border border-white/5 backdrop-blur-md">
                    <div className="text-[9px] text-slate-600 font-black uppercase mb-1">Theta Decay</div>
                    <div className="text-white font-mono text-sm">-34.2 bps</div>
                </div>
                <div className="glass-card px-6 py-3 border border-white/5 backdrop-blur-md">
                    <div className="text-[9px] text-slate-600 font-black uppercase mb-1">Vega Exposure</div>
                    <div className="text-white font-mono text-sm">+1.24%</div>
                </div>
            </div>

            <Canvas shadows gl={{ antialias: true }} camera={{ position: [18, 14, 18], fov: 35 }}>
                <React.Suspense fallback={null}>
                    <OrbitControls
                        enableZoom={true}
                        maxPolarAngle={Math.PI / 2.2}
                        minDistance={10}
                        maxDistance={40}
                        autoRotate
                        autoRotateSpeed={0.4}
                    />

                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[20, 20, 20]} intensity={2} color="#FFD700" castShadow />
                    <pointLight position={[-20, 10, -20]} intensity={1} color="#FFD700" />

                    <fog attach="fog" args={['#000', 10, 60]} />

                    <VolatilitySurface />
                    <Infrastructure3D />

                    {/* Visualizing Data Particles */}
                    {Array.from({ length: 30 }).map((_, i) => (
                        <Float key={`part-${i}`} speed={2} rotationIntensity={1} floatIntensity={1}>
                            <mesh position={[
                                (Math.random() - 0.5) * 12,
                                Math.random() * 4,
                                (Math.random() - 0.5) * 12
                            ]}>
                                <sphereGeometry args={[0.04, 6, 6]} />
                                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} />
                            </mesh>
                        </Float>
                    ))}

                    <ContactShadows position={[0, -3.1, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                </React.Suspense>
            </Canvas>
        </div>
    );
};
