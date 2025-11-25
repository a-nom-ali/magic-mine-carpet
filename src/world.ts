import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;

enum Block {
  Air,
  Stone,
}

class Chunk {
  public mesh: THREE.InstancedMesh;
  private data: Block[][][];

  constructor(scene: THREE.Scene, private x: number, private z: number) {
    this.data = this.initData();
    this.mesh = this.createMesh(scene);
  }

  private initData(): Block[][][] {
    const data: Block[][][] = [];
    for (let x = 0; x < CHUNK_SIZE; x++) {
      data[x] = [];
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        data[x][y] = [];
        for (let z = 0; z < CHUNK_SIZE; z++) {
          data[x][y][z] = Block.Air;
        }
      }
    }
    return data;
  }

  public setBlock(x: number, y: number, z: number, block: Block) {
    this.data[x][y][z] = block;
  }

  public getBlock(x: number, y: number, z: number): Block {
    return this.data[x][y][z];
  }

  private createMesh(scene: THREE.Scene): THREE.InstancedMesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const mesh = new THREE.InstancedMesh(geometry, material, CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT);
    mesh.position.set(this.x * CHUNK_SIZE, 0, this.z * CHUNK_SIZE);
    scene.add(mesh);
    return mesh;
  }

  public updateMesh() {
    let i = 0;
    const matrix = new THREE.Matrix4();
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          if (this.data[x][y][z] !== Block.Air) {
            matrix.setPosition(x, y, z);
            this.mesh.setMatrixAt(i, matrix);
            i++;
          }
        }
      }
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.count = i;
  }
}

class World {
  private scene: THREE.Scene;
  private noise: SimplexNoise;
  private chunks: Map<string, Chunk>;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.noise = new SimplexNoise();
    this.chunks = new Map();
  }

  public generate() {
    for (let x = 0; x < 2; x++) {
      for (let z = 0; z < 2; z++) {
        const chunk = new Chunk(this.scene, x, z);
        this.generateChunk(chunk, x, z);
        this.chunks.set(`${x},${z}`, chunk);
      }
    }
  }

  private generateChunk(chunk: Chunk, chunkX: number, chunkZ: number) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const height = Math.floor(this.noise.noise2D((chunkX * CHUNK_SIZE + x) / 50, (chunkZ * CHUNK_SIZE + z) / 50) * 10) + 20;
        for (let y = 0; y < height; y++) {
          chunk.setBlock(x, y, z, Block.Stone);
        }
      }
    }
    chunk.updateMesh();
  }
}

export default World;
