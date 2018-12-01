AFRAME.registerComponent('icosahedron-component', {

  schema: {
    analyserEl: {type: 'selector'},
  },

  init: function () {
    this.geometry;
    this.mesh;
  },

  update: function () {
    var analyserEl;
    var data = this.data;
    analyserEl = data.analyserEl || this.el;
    var el = this.el;

    this.geometry = new THREE.IcosahedronGeometry(30, 3)
    var material = new THREE.MeshBasicMaterial({color: new THREE.Color(0.2,0.2,0.2), wireframe:true});
    this.mesh = new THREE.Mesh( this.geometry, material );
    var mesh = this.mesh;
    el.setObject3D('testContainer', new THREE.Object3D());
    el.getObject3D('testContainer').add(this.mesh);

    analyserEl.addEventListener('audioanalyser-beat', function () {
      var mat = mesh.material;
      mat.color.setRGB(0.4,0.4,0.4);
      mat.needsUpdate = true;
    });
  },

  tick: function () {
    this.mesh.rotation.x += 0.003;
    this.mesh.rotation.y += 0.002;
    this.mesh.rotation.z += 0.002;
    var mat = this.mesh.material;
    if (mat.color.r != 0.1) {
      var r = Math.max(mat.color.r - 0.01, 0.25);
      var g = Math.max(mat.color.g - 0.01, 0.25);
      var b = Math.max(mat.color.b - 0.01, 0.25);
      mat.color.setRGB(r,g,b);
    }
  },

  remove: function () {
    this.el.removeObject3D('testContainer');
  }
});
