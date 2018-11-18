function create_buckets(freqs, lower_offset, higher_offset, num) {
    sliced_freqs = freqs.slice(lower_offset, freqs.length - higher_offset);
    var spectrum = [];
    var size = Math.floor(sliced_freqs.length / num);
    for (var i = 0; i < 32; i ++) {
        var sum = 0.0;
        for (var j = 0; j < size; j++) {
            sum += sliced_freqs[i*size + j] / size;
        }
        spectrum.push(sum);
    }
    return spectrum;
}

function interpolate(a,b,x,y,t) {
    var source_dist = y - x;
    var dist = (t-x) / source_dist;
    var target_dist = b - a;
    // console.log(dist * target_dist + a);
    return dist * target_dist + a;
}

function render_rings(freqs, lower, higher, sphere) {
    spectrum_32 = create_buckets(freqs, 75, 75, 32);
    // first vertex
    var val = interpolate(lower, higher, 0.0, 255.0, spectrum_32[0]);
    var temp = sphere.geometry.initialVertices[0].clone().multiplyScalar(val);
    sphere.geometry.vertices[0].multiplyScalar(0.0);
    sphere.geometry.vertices[0].add(temp);
    for (var i = 1; i < sphere.geometry.vertices.length; i +=1) {
        var index = Math.floor(i / 32) + 1;
        var val = interpolate(lower, higher, 0.0, 255.0, spectrum_32[index]);
        var temp = sphere.geometry.initialVertices[i].clone().multiplyScalar(val);
        sphere.geometry.vertices[i].multiplyScalar(0.0);
        sphere.geometry.vertices[i].add(temp);
    }
}

AFRAME.registerComponent('test-component', {

  schema: {
    analyserEl: {type: 'selector'},
  },

  init: function () {
    this.mesh;
    this.levels = [];
  },

  update: function () {
    var el = this.el;

    var geometry = new THREE.SphereGeometry( 1, 32, 31 );
    geometry.initialVertices = [];
    for (var i = 0; i < geometry.vertices.length; i++) {
        geometry.initialVertices.push(geometry.vertices[i].clone());
    }

    // var material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
    var material = new THREE.MeshLambertMaterial({color: 0x0ceeff});
    this.mesh = new THREE.Mesh( geometry, material );
    el.setObject3D('testContainer', new THREE.Object3D());
    el.getObject3D('testContainer').add(this.mesh);
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

    render_rings(levels, 0.5, 1.5, sphere);
    sphere.geometry.verticesNeedUpdate = true;
    // sphere.rotation.x += 0.03;
    // sphere.rotation.y += 0.02;
    // sphere.rotation.z += 0.02;
  },

  remove: function () {
    this.el.removeObject3D('testContainer');
  }
});
