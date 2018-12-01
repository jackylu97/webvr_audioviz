NUM_CUBES = 20;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

AFRAME.registerComponent('cubes-component', {

  schema: {
    analyserEl: {type: 'selector'},
  },

  init: function () {
    this.rings = [];
    this.geometry;
  },

  update: function () {
    var analyserEl;
    var data = this.data;
    analyserEl = data.analyserEl || this.el;
    var el = this.el;
    var i;
    var mesh;
    var loopShape;
    var material;
    var scale;

    // Create container object.
    el.setObject3D('cubeContainer', new THREE.Object3D());
    var size = rand(0.5,1.0)
    this.geometry = new THREE.BoxGeometry( size, size, size );
    for (var i = 0; i < NUM_CUBES; i++) {
      // Create ring
      if (Math.random() > 0.3) {
        material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
      } else {
        material = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: true} );
      }

      mesh = new THREE.Mesh(this.geometry, material);
      mesh.position.set(rand(-10,10), rand(0,10), rand(-10,10));
      this.geometry.verticesNeedUpdate = true;
      this.rings.push(mesh);
      el.getObject3D('cubeContainer').add(mesh);
    }

    var rings = this.rings;
    var geometry = this.geometry;

    analyserEl.addEventListener('audioanalyser-beat', function () {

      for (var i = 0; i < NUM_CUBES; i++) {
        var r = Math.random();
        var g = Math.random();
        var b = Math.random();
        var mesh = rings[i];
        mesh.position.set(rand(-10,10), rand(0,10), rand(-10,10));
        var mat = mesh.material;
        if (mat.color != null) {
          mat.color.setRGB(r,g,b);
        }
      }
      geometry.verticesNeedUpdate = true;
    });
  },

  tick: function () {
    for (var i = 0; i < NUM_CUBES; i++) {
      // Create ring
      cube = this.rings[i];
      cube.rotation.x += rand(0.01, 0.1);
      cube.rotation.y += rand(0.01, 0.1);
      cube.rotation.z += rand(0.01, 0.1);
    }
  },

  remove: function () {
    this.el.removeObject3D('cubeContainer');
  }
});
