"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  FAMILY_EDGES,
  FAMILY_NODES,
  connectionCount,
  type FamilyNode,
} from "@/lib/jenkins-family";
import { positionFor } from "./layout";

interface BrainGraphProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface NodeMesh {
  id: string;
  mesh: THREE.Mesh;
  baseColor: THREE.Color;
  baseScale: number;
  labelEl: HTMLDivElement;
  node: FamilyNode;
}

const BG_COLOR = 0x111111;
const EDGE_COLOR = new THREE.Color(0xffffff);
const EDGE_OPACITY_TOPIC = 0.18;
const EDGE_OPACITY_KIN = 0.32;

export function BrainGraph({ selectedId, onSelect }: BrainGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  // Mutable refs that survive re-renders without retriggering effect
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const container = containerRef.current;
    const labelLayer = labelsRef.current;
    if (!container || !labelLayer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ---- Scene setup ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(2, 4, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Subtle lighting — we want flat-ish read of node color, not photoreal shading
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.4);
    key.position.set(5, 8, 6);
    scene.add(key);

    // ---- Edges ----
    const edgeGroup = new THREE.Group();
    for (const e of FAMILY_EDGES) {
      const a = positionFor(e.from);
      const b = positionFor(e.to);
      const geom = new THREE.BufferGeometry().setFromPoints([a, b]);
      const mat = new THREE.LineBasicMaterial({
        color: EDGE_COLOR,
        transparent: true,
        opacity: e.kind === "kin" ? EDGE_OPACITY_KIN : EDGE_OPACITY_TOPIC,
      });
      edgeGroup.add(new THREE.Line(geom, mat));
    }
    scene.add(edgeGroup);

    // ---- Nodes ----
    const nodeMeshes: NodeMesh[] = [];

    for (const node of FAMILY_NODES) {
      const isPerson = node.kind === "person";
      const conn = connectionCount(node.id);
      // Person radius: 0.45 + 0.05 per connection. Topic: slightly larger.
      const baseScale = isPerson ? 0.45 + conn * 0.05 : 0.7 + conn * 0.04;
      const color = new THREE.Color(node.color);

      const geom = new THREE.SphereGeometry(1, 32, 24);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.0,
        // Topic nodes muted with lower emissive to read as background-y
        emissive: color,
        emissiveIntensity: isPerson ? 0.12 : 0.06,
        opacity: isPerson ? 1.0 : 0.85,
        transparent: !isPerson,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(positionFor(node.id));
      mesh.scale.setScalar(baseScale);
      mesh.userData.id = node.id;
      scene.add(mesh);

      // Floating label
      const labelEl = document.createElement("div");
      labelEl.className = "brain-label";
      labelEl.textContent = isPerson
        ? `${node.avatar}  ${node.name}`
        : `${node.icon}  ${node.title}`;
      labelEl.dataset.id = node.id;
      labelLayer.appendChild(labelEl);

      nodeMeshes.push({ id: node.id, mesh, baseColor: color, baseScale, labelEl, node });
    }

    // ---- Controls ----
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 28;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Stop auto-rotate as soon as the user touches it. Resume after 12s idle.
    let idleTimer: number | null = null;
    const onUserStart = () => {
      controls.autoRotate = false;
      if (idleTimer !== null) window.clearTimeout(idleTimer);
    };
    const onUserEnd = () => {
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 12_000);
    };
    controls.addEventListener("start", onUserStart);
    controls.addEventListener("end", onUserEnd);

    // ---- Picking ----
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredId: string | null = null;
    let pointerDownAt = { x: 0, y: 0, t: 0 };

    const onPointerMove = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      const newId = hits[0]?.object.userData.id ?? null;
      if (newId !== hoveredId) {
        hoveredId = newId;
        renderer.domElement.style.cursor = newId ? "pointer" : "grab";
      }
    };

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownAt = { x: ev.clientX, y: ev.clientY, t: performance.now() };
    };
    const onPointerUp = (ev: PointerEvent) => {
      const dx = ev.clientX - pointerDownAt.x;
      const dy = ev.clientY - pointerDownAt.y;
      const dt = performance.now() - pointerDownAt.t;
      // Treat as tap only if the pointer barely moved and was quick.
      const isTap = Math.hypot(dx, dy) < 6 && dt < 350;
      if (!isTap) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      const id = hits[0]?.object.userData.id ?? null;
      onSelectRef.current(id);
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.style.cursor = "grab";

    // ---- Camera fly-to ----
    let camAnim: {
      from: THREE.Vector3;
      to: THREE.Vector3;
      target: THREE.Vector3;
      startTarget: THREE.Vector3;
      t0: number;
      dur: number;
    } | null = null;

    const flyTo = (id: string | null) => {
      if (!id) {
        camAnim = {
          from: camera.position.clone(),
          to: new THREE.Vector3(2, 4, 14),
          target: new THREE.Vector3(0, 0, 0),
          startTarget: controls.target.clone(),
          t0: performance.now(),
          dur: 900,
        };
        return;
      }
      const target = positionFor(id);
      // Sit ~6 units back along the camera-target axis from the node
      const dir = camera.position.clone().sub(controls.target).normalize();
      const dest = target.clone().add(dir.multiplyScalar(6));
      camAnim = {
        from: camera.position.clone(),
        to: dest,
        target,
        startTarget: controls.target.clone(),
        t0: performance.now(),
        dur: 900,
      };
    };

    let lastSelectedId = selectedIdRef.current;
    flyTo(lastSelectedId);

    // ---- Resize ----
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ---- Render loop ----
    let rafId = 0;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = () => {
      // Watch for selection changes from props (without re-running effect)
      if (selectedIdRef.current !== lastSelectedId) {
        lastSelectedId = selectedIdRef.current;
        flyTo(lastSelectedId);
      }

      // Camera animation
      if (camAnim) {
        const t = Math.min(1, (performance.now() - camAnim.t0) / camAnim.dur);
        const e = easeInOutCubic(t);
        camera.position.lerpVectors(camAnim.from, camAnim.to, e);
        controls.target.lerpVectors(camAnim.startTarget, camAnim.target, e);
        if (t >= 1) camAnim = null;
      }

      controls.update();

      // Hover/select highlight: scale + emissive
      for (const n of nodeMeshes) {
        const isHovered = n.id === hoveredId;
        const isSelected = n.id === selectedIdRef.current;
        const targetScale = n.baseScale * (isSelected ? 1.25 : isHovered ? 1.12 : 1.0);
        n.mesh.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          0.15,
        );
        const mat = n.mesh.material as THREE.MeshStandardMaterial;
        const targetEmissive = isSelected ? 0.45 : isHovered ? 0.28 : 0.12;
        mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.18;
      }

      // Project labels to screen — billboard via DOM, not Three sprites
      const proj = new THREE.Vector3();
      const halfW = container.clientWidth / 2;
      const halfH = container.clientHeight / 2;
      for (const n of nodeMeshes) {
        proj.copy(n.mesh.position).project(camera);
        const x = proj.x * halfW + halfW;
        const y = -proj.y * halfH + halfH - n.baseScale * 60;
        const visible = proj.z < 1;
        n.labelEl.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        n.labelEl.style.opacity = visible ? "1" : "0";
        n.labelEl.classList.toggle(
          "active",
          n.id === selectedIdRef.current || n.id === hoveredId,
        );
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(rafId);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.removeEventListener("start", onUserStart);
      controls.removeEventListener("end", onUserEnd);
      controls.dispose();
      // Dispose meshes + edges + materials + geometries
      for (const n of nodeMeshes) {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
        n.labelEl.remove();
      }
      edgeGroup.traverse((obj) => {
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ background: `#${BG_COLOR.toString(16).padStart(6, "0")}` }}
    >
      <div ref={labelsRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
