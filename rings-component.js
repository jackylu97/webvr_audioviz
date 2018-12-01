var NUM_RINGS = 4;
var LEVELS_INC = 200;

AFRAME.registerComponent('rings-component', {

  schema: {
    analyserEl: {type: 'selector'},
  },

  init: function () {
    this.rings = [];
    this.geometry;
    this.colors = [];
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    var i;
    var lineMesh;
    var loopShape;
    var material;
    var scale;

    // Create container object.
    el.setObject3D('ringContainer', new THREE.Object3D());

    this.geometry = new THREE.RingGeometry( 3.7, 4, 32 );
    this.colors = [0xffff00, 0x2575f7, 0x31ea20, 0xcc1467];
    for (var i = 0; i < NUM_RINGS; i++) {
      // Create ring
      material = new THREE.MeshBasicMaterial( { color: this.colors[i], side: THREE.DoubleSide } );

      mesh = new THREE.Mesh(this.geometry, material);
      mesh.position.set(0, 0, -0.1 * i);
      this.rings.push(mesh);
      el.getObject3D('ringContainer').add(mesh);
    }
  },

  tick: function () {
    var analyserEl;
    var data = this.data
    var levels;
    var el = this.el;
    var sphere = this.mesh;

    analyserEl = data.analyserEl || this.el;
    levels = analyserEl.components.audioanalyser.levels;
    if (!levels) {
      console.log("levels not found!");
      return;
    }
    for (var i = 0; i < NUM_RINGS; i++) {
      var value = levels[10 + i * LEVELS_INC];
      value = Math.max(value - 80, 0.1);
      mesh = this.rings[i];
      mesh.scale.x = 0.3 + value / 30;
      mesh.scale.y = 0.3 + value / 30;
    }
    this.geometry.verticesNeedUpdate = true;


  },

  remove: function () {
    this.el.removeObject3D('ringContainer');
  }
});
