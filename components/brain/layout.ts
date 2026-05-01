/**
 * Manual node layout for the Brain graph.
 *
 * Decision: hand-placed positions (not force-directed). With 12 nodes the
 * relationships are meaningful enough that we want stable, predictable
 * placement — kids cluster around parents, topics ring the family, Eli sits
 * close to Marcus to reflect the parallel-play kin edge.
 *
 * A force layout adds a heavy dep + non-determinism between sessions; the
 * cost outweighs the benefit at this scale.
 */

import * as THREE from "three";
import { FAMILY_NODES, type FamilyNode } from "@/lib/jenkins-family";

export type Vec3 = [number, number, number];

const POSITIONS: Record<string, Vec3> = {
  // Parents on a horizontal axis at the center
  monica: [-3, 1, 0],
  david: [3, 1, 0],

  // Kids in a slight arc below the parents
  zoe: [-5, -2, 1.5],
  marcus: [-1.5, -2.5, 0.5],
  // Eli sits close to Marcus (parallel-play edge)
  eli: [0.2, -2.8, 1.8],
  priya: [3.5, -2.2, -0.5],

  // Topics ring the cluster at varied depths
  "safe-foods": [-5.5, 2.5, -3],
  medical: [5.5, 2.8, -2.5],
  school: [-2, 4.5, -3.5],
  "house-systems": [4.5, -1, -4],
  memories: [0, 3.5, 3.5],
  emergency: [-4, -4.5, -2],
};

export function positionFor(id: string): THREE.Vector3 {
  const p = POSITIONS[id] ?? [0, 0, 0];
  return new THREE.Vector3(p[0], p[1], p[2]);
}

export function allPositions(): Array<{ node: FamilyNode; pos: THREE.Vector3 }> {
  return FAMILY_NODES.map((n) => ({ node: n, pos: positionFor(n.id) }));
}
