import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Inventory from './inventory';

const MOUSE_SENSITIVITY = 0.002;
const MOVEMENT_FORCE = 10;

class Player {
  public mesh: THREE.Mesh;
  public body: CANNON.Body;
  public inventory: Inventory;

  private camera: THREE.PerspectiveCamera;
  private input: { [key: string]: boolean };
  private yawPivot: THREE.Object3D;
  private pitchPivot: THREE.Object3D;

  constructor(scene: THREE.Scene, world: CANNON.World, camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.input = {};
    this.inventory = new Inventory();

    // Create the magic carpet model
    const geometry = new THREE.BoxGeometry(2, 0.1, 3);
    const material = new THREE.MeshStandardMaterial({ color: 0x800080 });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    // Create pivots for the camera
    this.yawPivot = new THREE.Object3D();
    this.pitchPivot = new THREE.Object3D();
    this.yawPivot.add(this.pitchPivot);
    this.pitchPivot.add(this.camera);
    scene.add(this.yawPivot);
    // Position camera for first-person view, slightly above the carpet
    this.camera.position.set(0, 0.5, 0);

    // Create the physics body
    const shape = new CANNON.Box(new CANNON.Vec3(1, 0.05, 1.5));
    this.body = new CANNON.Body({ mass: 1 });
    this.body.addShape(shape);
    this.body.position.set(0, 10, 0);
    world.addBody(this.body);

    this.setupControls();
  }

  private setupControls() {
    window.addEventListener('keydown', (e) => {
      this.input[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.input[e.key] = false;
    });

    document.body.addEventListener('click', () => {
      document.body.requestPointerLock();
    });

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === document.body) {
        this.yawPivot.rotation.y -= e.movementX * MOUSE_SENSITIVITY;
        this.pitchPivot.rotation.x -= e.movementY * MOUSE_SENSITIVITY;
        this.pitchPivot.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchPivot.rotation.x));
      }
    });
  }

  public update() {
    this.handleInput();

    this.mesh.position.copy(this.body.position as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);

    // Update pivot position to follow the player
    this.yawPivot.position.copy(this.mesh.position);
  }

  private handleInput() {
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    const right = new THREE.Vector3().crossVectors(this.camera.up, forward).normalize();

    const moveDirection = new THREE.Vector3();

    if (this.input['w']) {
      moveDirection.add(forward);
    }
    if (this.input['s']) {
      moveDirection.sub(forward);
    }
    if (this.input['a']) {
      moveDirection.sub(right);
    }
    if (this.input['d']) {
      moveDirection.add(right);
    }

    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize();
      this.body.applyForce(moveDirection.multiplyScalar(MOVEMENT_FORCE) as any);
    }

    // Rotate the player to match the camera's yaw
    const targetQuaternion = new CANNON.Quaternion();
    targetQuaternion.setFromEuler(0, this.yawPivot.rotation.y, 0);
    this.body.quaternion = this.body.quaternion.slerp(targetQuaternion, 0.2);
  }
}

export default Player;
