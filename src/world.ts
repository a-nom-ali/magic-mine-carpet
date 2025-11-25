import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SimplexNoise from 'simplex-noise';
import { Resource, resourceProperties } from './resources';

const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;

enum Block {
  Air,
  Stone,
  Wood,
}

class Chunk {
  public mesh: THREE.Mesh;
  public body: CANNON.Body;
  private data: Block[][][];

  constructor(scene: THREE.Scene, world: CANNON.World, private chunkX: number, private chunkZ: number) {
    this.data = this.initData();
    this.mesh = this.createMesh(scene);
    this.body = this.createBody(world);
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
    if (x >= 0 && x < CHUNK_SIZE && y >= 0 && y < WORLD_HEIGHT && z >= 0 && z < CHUNK_SIZE) {
      this.data[x][y][z] = block;
    }
  }

  public getBlock(x: number, y: number, z: number): Block {
    if (x >= 0 && x < CHUNK_SIZE && y >= 0 && y < WORLD_HEIGHT && z >= 0 && z < CHUNK_SIZE) {
      return this.data[x][y][z];
    }
    return Block.Air;
  }

  private createMesh(scene: THREE.Scene): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial({ vertexColors: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.chunkX * CHUNK_SIZE, 0, this.chunkZ * CHUNK_SIZE);
    scene.add(mesh);
    return mesh;
  }

  private createBody(world: CANNON.World): CANNON.Body {
    const body = new CANNON.Body({ mass: 0 });
    body.position.set(this.chunkX * CHUNK_SIZE, 0, this.chunkZ * CHUNK_SIZE);
    world.addBody(body);
    return body;
  }

  public updateMesh() {
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    let index = 0;

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        for (let x = 0; x < CHUNK_SIZE; ) {
          const block = this.getBlock(x, y, z);
          if (block === Block.Air) {
            x++;
            continue;
          }

          let w = 1;
          while (x + w < CHUNK_SIZE && this.getBlock(x + w, y, z) === block) {
            w++;
          }

          const color = new THREE.Color(resourceProperties[block === Block.Stone ? Resource.Stone : Resource.Wood].color);

          // front face
          if (this.getBlock(x, y, z - 1) === Block.Air) {
            vertices.push(x, y, z, x + w, y, z, x, y + 1, z, x + w, y + 1, z);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b);
            indices.push(index, index + 1, index + 2, index + 1, index + 3, index + 2);
            index += 4;
          }

          // back face
          if (this.getBlock(x, y, z + 1) === Block.Air) {
            vertices.push(x, y, z + 1, x + w, y, z + 1, x, y + 1, z + 1, x + w, y + 1, z + 1);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b);
            indices.push(index + 2, index + 1, index, index + 2, index + 3, index + 1);
            index += 4;
          }

          // left face
          if (this.getBlock(x - 1, y, z) === Block.Air) {
            vertices.push(x, y, z, x, y, z + 1, x, y + 1, z, x, y + 1, z + 1);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b);
            indices.push(index, index + 1, index + 2, index + 1, index + 3, index + 2);
            index += 4;
          }

          // right face
          if (this.getBlock(x + w, y, z) === Block.Air) {
            vertices.push(x + w, y, z, x + w, y, z + 1, x + w, y + 1, z, x + w, y + 1, z + 1);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b);
            indices.push(index + 2, index + 1, index, index + 2, index + 3, index + 1);
            index += 4;
          }

          // top face
          if (this.getBlock(x, y + 1, z) === Block.Air) {
            vertices.push(x, y + 1, z, x + w, y + 1, z, x, y + 1, z + 1, x + w, y + 1, z + 1);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b);
            indices.push(index, index + 1, index + 2, index + 1, index + 3, index + 2);
            index += 4;
          }

          // bottom face
          if (this.getBlock(x, y - 1, z) === Block.Air) {
            vertices.push(x, y, z, x + w, y, z, x, y, z + 1, x + w, y, z + 1);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b, color.r, color.g, color.b);
            indices.push(index + 2, index + 1, index, index + 2, index + 3, index + 1);
            index += 4;
          }

          x += w;
        }
      }
    }

    this.mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.mesh.geometry.setIndex(indices);
    this.mesh.geometry.computeVertexNormals();
  }

  public updatePhysics() {
    this.body.shapes.forEach((shape) => this.body.removeShape(shape));

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
          const block = this.getBlock(x, y, z);
          if (block !== Block.Air) {
            const isExposed =
              this.getBlock(x + 1, y, z) === Block.Air ||
              this.getBlock(x - 1, y, z) === Block.Air ||
              this.getBlock(x, y + 1, z) === Block.Air ||
              this.getBlock(x, y - 1, z) === Block.Air ||
              this.getBlock(x, y, z + 1) === Block.Air ||
              this.getBlock(x, y, z - 1) === Block.Air;

            if (isExposed) {
              const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
              this.body.addShape(shape, new CANNON.Vec3(x + 0.5, y + 0.5, z + 0.5));
            }
          }
        }
      }
    }
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

  public getChunk(chunkX: number, chunkZ: number): Chunk | undefined {
    return this.chunks.get(`${chunkX},${chunkZ}`);
  }

  public removeBlock(x: number, y: number, z: number) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkZ = Math.floor(z / CHUNK_SIZE);
    const chunk = this.getChunk(chunkX, chunkZ);
    if (chunk) {
      const blockX = x % CHUNK_SIZE;
      const blockY = y;
      const blockZ = z % CHUNK_SIZE;
      chunk.setBlock(blockX, blockY, blockZ, Block.Air);
      chunk.updateMesh();
      chunk.updatePhysics();
    }
  }

  private generateChunk(chunk: Chunk, chunkX: number, chunkZ: number) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const height = Math.floor(this.noise.noise2D((chunkX * CHUNK_SIZE + x) / 50, (chunkZ * CHUNK_SIZE + z) / 50) * 10) + 20;
        for (let y = 0; y < height; y++) {
          chunk.setBlock(x, y, z, Block.Stone);
        }

        if (Math.random() < 0.1) {
          const treeHeight = Math.floor(Math.random() * 5) + 3;
          for (let i = 0; i < treeHeight; i++) {
            chunk.setBlock(x, height + i, z, Block.Wood);
          }
        }
      }
    }
    chunk.updateMesh();
    chunk.updatePhysics();
  }
}

export default World;
