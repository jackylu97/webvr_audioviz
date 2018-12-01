NUM_SPHERES = 25;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function calc_position(radius, t) {
  // x = rcos(t)
  // y = rsin(t)
  // z = 0
  return [
    radius * Math.cos(t),
    radius * Math.sin(t),
    0.1];
}

AFRAME.registerComponent('thing-component', {

  schema: {
    analyserEl: {type: 'selector'},
  },

  init: function () {
    this.rings = [];
    this.geometry;
    this.radius = 10;
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
    // Create container object.
    el.setObject3D('thingContainer', new THREE.Object3D());

    this.geometry = new THREE.SphereGeometry( 0.1, 14, 14 );
    for (var i = 0; i < NUM_SPHERES; i++) {
      material = new THREE.MeshBasicMaterial( { color: 0xffffff} );

      mesh = new THREE.Mesh(this.geometry, material);
      var angle = (i / (NUM_SPHERES/2)) * Math.PI;
      var pos = calc_position(this.radius, angle)
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.angle_val = angle;
      this.geometry.verticesNeedUpdate = true;
      this.rings.push(mesh);
      el.getObject3D('thingContainer').add(mesh);
    }
  },

  tick: function () {
    var analyserEl;
    var data = this.data;
    analyserEl = data.analyserEl || this.el;
    var el = this.el;
    volume = analyserEl.components.audioanalyser.volume;
    el.object3D.rotation.x += Math.random() / 200;
    el.object3D.rotation.y += Math.random() / 200;
    el.object3D.rotation.z += volume * 4 / 10000;
  },

  remove: function () {
    this.el.removeObject3D('thingContainer');
  }
});
