import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SimplexNoise from 'simplex-noise';

const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;

enum Block {
  Air,
  Stone,
}

class Chunk {
  public mesh: THREE.Mesh;
  public body: CANNON.Body;
  private data: number[][];

  constructor(scene: THREE.Scene, world: CANNON.World, private x: number, private z: number) {
    this.data = this.initData();
    this.mesh = this.createMesh(scene);
    this.body = this.createBody(world);
  }

  private initData(): number[][] {
    const data: number[][] = [];
    for (let x = 0; x < CHUNK_SIZE; x++) {
      data[x] = [];
      for (let z = 0; z < CHUNK_SIZE; z++) {
        data[x][z] = 0;
      }
    }
    return data;
  }

  public setHeight(x: number, z: number, height: number) {
    this.data[x][z] = height;
  }

  private createMesh(scene: THREE.Scene): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE - 1, CHUNK_SIZE - 1);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.x * CHUNK_SIZE + CHUNK_SIZE / 2, 0, this.z * CHUNK_SIZE + CHUNK_SIZE / 2);
    scene.add(mesh);
    return mesh;
  }

  private createBody(world: CANNON.World): CANNON.Body {
    const shape = new CANNON.Heightfield(this.data, {
      elementSize: 1,
    });
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(this.x * CHUNK_SIZE, 0, this.z * CHUNK_SIZE);
    world.addBody(body);
    return body;
  }

  public updateMesh() {
    for (let i = 0; i < this.mesh.geometry.attributes.position.count; i++) {
      const x = i % CHUNK_SIZE;
      const z = Math.floor(i / CHUNK_SIZE);
      (this.mesh.geometry.attributes.position.array as any)[i * 3 + 1] = this.data[x][z];
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }
}

class World {
  private scene: THREE.Scene;
  private physicsWorld: CANNON.World;
  private noise: SimplexNoise;
  private chunks: Map<string, Chunk>;

  constructor(scene: THREE.Scene, physicsWorld: CANNON.World) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.noise = new SimplexNoise();
    this.chunks = new Map();
  }

  public generate() {
    for (let x = 0; x < 2; x++) {
      for (let z = 0; z < 2; z++) {
        const chunk = new Chunk(this.scene, this.physicsWorld, x, z);
        this.generateChunk(chunk, x, z);
        this.chunks.set(`${x},${z}`, chunk);
      }
    }
  }

  private generateChunk(chunk: Chunk, chunkX: number, chunkZ: number) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const height = Math.floor(this.noise.noise2D((chunkX * CHUNK_SIZE + x) / 50, (chunkZ * CHUNK_SIZE + z) / 50) * 10) + 20;
        chunk.setHeight(x, z, height);
      }
    }
    chunk.updateMesh();
  }
}

export default World;
