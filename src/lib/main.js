const scene = new Scene(document.getElementById("canvas"));

const h = new SenkiArray(1, 20, 4, 5, 8, 10, 8);

window.h = h

scene.add(h.senkiNode);

console.log(scene);
