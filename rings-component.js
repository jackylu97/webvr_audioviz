var NUM_RINGS = 4;
var LEVELS_INC = 25;

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

    // Create ring geometries.
    loopShape = new THREE.Shape();
    loopShape.absarc(0, 0, 1, 0, Math.PI * 2, false);
    // var points = loopShape.getPoints();
    // this.geometry = new THREE.BufferGeometry().setFromPoints( points );
    this.geometry = loopShape.createPointsGeometry(128);
    this.colors = [0xffffff, 0x2575f7, 0x31ea20, 0xcc1467];

    for (var i = 0; i < NUM_RINGS; i++) {
      // Create ring
      material = new THREE.LineBasicMaterial({
        color: this.colors[i],
        linewidth: 1 ,
        opacity : 0.7,
        blending : THREE.AdditiveBlending,
        depthTest : true,
        transparent : true
      });
      mesh = new THREE.Line(this.geometry, material);
      this.rings.push(mesh);
      el.getObject3D('ringContainer').add(mesh);
    }
    console.log(this.rings);
    console.log(el.getObject3D('ringContainer'));
  },

  tick: function () {
    var analyserEl;
    var data = this.data
    var mesh = this.mesh;
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
      value = Math.max(value - 120, 0.1);
      mesh = this.rings[i];
      mesh.scale.x = 0.5 + value / 40;
      mesh.scale.y = 0.5 + value / 40;
    }
    // this.geometry.verticesNeedUpdate = true;


  },

  remove: function () {
    this.el.removeObject3D('ringContainer');
  }
});
