NUM_SPHERES = 25;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

AFRAME.registerComponent('spheres-component', {

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
    el.setObject3D('sphereContainer', new THREE.Object3D());

    this.geometry = new THREE.SphereGeometry( rand(0.5, 1.0), 30, 30 );
    for (var i = 0; i < NUM_SPHERES; i++) {
      // Create ring
      // if (Math.random() > 0.3) {
      //   material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
      // } else {
      //   material = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: true} );
      // }
      material = new THREE.MeshBasicMaterial( { color: 0xffffff} );

      mesh = new THREE.Mesh(this.geometry, material);
      // var size = rand(0.2, 0.6);
      mesh.scale.x = 0.3;
      mesh.scale.y = 0.3;
      mesh.scale.z = 0.3;
      mesh.position.set(rand(-10,10), rand(0,10), rand(-10,10));
      this.geometry.verticesNeedUpdate = true;
      this.rings.push(mesh);
      el.getObject3D('sphereContainer').add(mesh);
    }

    var rings = this.rings;
    var geometry = this.geometry;

    analyserEl.addEventListener('audioanalyser-beat', function () {

      for (var i = 0; i < NUM_SPHERES; i++) {
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
    var analyserEl;
    var data = this.data;
    analyserEl = data.analyserEl || this.el;
    for (var i = 0; i < NUM_SPHERES; i++) {
      // Create ring
      var mesh = this.rings[i];
      volume = analyserEl.components.audioanalyser.volume;
      mesh.scale.x = volume / 200;
      mesh.scale.y = volume / 200;
      mesh.scale.z = volume / 200;
    }
    this.geometry.verticesNeedUpdate = true;
  },

  remove: function () {
    this.el.removeObject3D('sphereContainer');
  }
});
