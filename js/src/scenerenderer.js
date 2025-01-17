function SceneRenderer(space, width, height) {
  // Init variables required for rendering
  this._aspectFix = new THREE.Matrix4();

  var skyboxLoader = new THREE.CubeTextureLoader;

  function loadSkybox(dir, ext) {
    ext = ext || "jpg";
    var files = [
      "sky_pos_x", "sky_neg_x",
      "sky_pos_y", "sky_neg_y",
      "sky_pos_z", "sky_neg_z"
    ].map(function(file) {
      return dir + file + "." + ext;
    });

    var textureCube = skyboxLoader.load(files);
    textureCube.format = THREE.RGBFormat;

    return textureCube;
  }

  this._uniforms = {
    uRadiusSquared: { type: "f", value: space.radiusSquared },
    uThroatLength: { type: "f", value: space.throatLength },
    uSkybox1: { type: "t", value: loadSkybox("textures/skybox1/") },
    uSkybox2: { type: "t", value: loadSkybox("textures/skybox2/") },
    uCameraPosition: { type: "v3", value: new THREE.Vector3() },
    uCameraOrientation: { type: "m4", value: new THREE.Matrix4() },
  };

  // Init shader
  this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  this._scene = new THREE.Scene();

  var geometry = new THREE.BufferGeometry();
  var vertices = new THREE.BufferAttribute(new Float32Array([
    -1.0, -1.0,
    -1.0, +1.0,
    +1.0, +1.0,
    -1.0, -1.0,
    +1.0, +1.0,
    +1.0, -1.0,
  ]), 2);

  geometry.addAttribute('position', vertices);

  var material = new THREE.RawShaderMaterial({
    uniforms: this._uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    side: THREE.DoubleSide,
  });

  var mesh = new THREE.Mesh(geometry, material);
  this._scene.add(mesh);
}

SceneRenderer.prototype = {

  render: function(renderer, camera, renderTarget) {
    this._uniforms.uCameraPosition.value.copy(camera.position);

    this._uniforms.uCameraOrientation.value.makeRotationFromQuaternion(camera.quaternion);
    this._uniforms.uCameraOrientation.value.multiply(this._aspectFix)

    renderer.render(this._scene, this._camera, renderTarget);
  },

  setSize: function(width, height) {
    this._renderWidth = width;
    this._renderHeight = height;

    var vx, vy;
    if (width > height)
    {
      vx = width / height;
      vy = 1;
    }
    else
    {
      vx = 1;
      vy = height / width;
    }

    this._aspectFix.set(vx,  0, 0, 0,
                        0, vy, 0, 0,
                        0,  0, 2, 0,
                        0,  0, 0, 1);
  }
};

module.exports = SceneRenderer;
