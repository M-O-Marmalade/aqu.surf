let waterCanvas = document.createElement("canvas");
waterCanvas.style.position = "fixed";
waterCanvas.style.top = 0;
waterCanvas.style.margin = 0;
waterCanvas.style.width = "100%";
waterCanvas.style.height = "100%";
waterCanvas.style.overflow = "hidden";
waterCanvas.style.zIndex = -10;
document.body.appendChild(waterCanvas);

const portrait = screen.width > screen.height ? false : true;

const fps = 60;
const msPerFrame = 1000/fps;
let readyToRender = true;
const damping = 0.984;
const pointerStrength = 0.127;
const pointerSize = 2;

const totalSegments = 48000;
let wX = window.innerWidth;
let wY = window.innerHeight;
let wXYgcd = gcd(wX, wY);
let aspectScale = aspectScaleSolve(wX/wXYgcd , wY/wXYgcd , totalSegments);
const xSeg = Math.floor(wX/wXYgcd * aspectScale);
const ySeg = Math.floor(wY/wXYgcd * aspectScale);
const yPoi = ySeg + 1;
const xPoi = xSeg + 1;            

const prev = new Array(xPoi * yPoi).fill(0);
const curr = new Array(xPoi * yPoi).fill(0);

//scene & camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0044ff );
// const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(53, wX / wY, 0.5, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1;
camera.lookAt(0,0,0);

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: waterCanvas
});
// renderer.alpha = true;
// renderer.setClearColor(0x000000, 0);
if (!portrait) {  //if we're in landscape aspect, we'll assume desktop-grade performance
    renderer.setPixelRatio( window.devicePixelRatio );
}            
renderer.setSize( wX, wY );

// light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(2,2,10);
//scene.add( light );

// materials
const refractiveMat = new THREE.MeshPhysicalMaterial({
    side: THREE.BackSide,
    transmission: 1.0,
    roughness: 0,
    ior: 1.333,
    thickness: 10,
    //reflectivity: 1,
});

const normalMat = new THREE.MeshNormalMaterial({
    side: THREE.FrontSide,
    //flatShading: true
});

const vertMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.FrontSide
});

const phongMat = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x0000ff,
    //vertexColors: true,
    side: THREE.BackSide
});

// water geometry
const waterGeometry = new THREE.BufferGeometry();

//water attributes
const waterIndices = [];
const waterPositions = [];
const waterNormals = [];
// const waterColors = [];

let counter = 0;

// generate water positions, normals and color data for a simple grid geometry
for ( let i = 0; i < yPoi; i++ ) {

    const y = (i / ySeg) - 0.5;    //set y position from 0 - 1

    for ( let j = 0; j < xPoi; j++ ) {

        const x = ((j / xSeg) - 0.5) * wX / wY;    //set x position from 0 - 1

        waterPositions.push( x, y, 0 );
        waterNormals.push( 0, 0, -1 );
        // waterColors.push( x,y,x/2 + y/2 );

        counter++;
    }
}

// generate water indices (data for element array buffer)
for ( let i = 0; i < ySeg; i++ ) {

    for ( let j = 0; j < xSeg; j++ ) {

        const a = i * ( xSeg + 1 ) + ( j + 1 );
        const b = i * ( xSeg + 1 ) + j;
        const c = ( i + 1 ) * ( xSeg + 1 ) + j;
        const d = ( i + 1 ) * ( xSeg + 1 ) + ( j + 1 );

        // generate two faces (triangles) per iteration
        waterIndices.push( a, b, d ); // face one
        waterIndices.push( b, c, d ); // face two
    }
}

//set water mesh data and add to scene
waterGeometry.setIndex( waterIndices );            
const positionsA = new THREE.Float32BufferAttribute(waterPositions,3);
const normalsA = new THREE.Float32BufferAttribute(waterNormals,3);
// const colorsA = new THREE.Float32BufferAttribute(waterColors,3);
waterGeometry.setAttribute( 'position', positionsA );
waterGeometry.setAttribute( 'normal', normalsA );
// waterGeometry.setAttribute( 'color', colorsA);
const waterMesh = new THREE.Mesh( waterGeometry, refractiveMat );
scene.add( waterMesh );

//add torus to scene
const torusGeometry = new THREE.TorusKnotGeometry(10, 2.3, 256, 64);
const torusMesh = new THREE.Mesh( torusGeometry, normalMat);
torusMesh.position.z = -0.5;
torusMesh.scale.x = 0.06;
torusMesh.scale.y = 0.032;
torusMesh.scale.z = 0.04;
scene.add(torusMesh);

//add bg plane to scene
const bgPlaneGeometry = new THREE.BufferGeometry();
const bgPlaneIndices = [
    1, 0, 3,
    0, 2, 3
];
const bgPlanePositions = [
    -0.77, 0.77, -1.5,
    0.77, 0.77, -1.5,
    -0.77, -0.77, -1.5,
    0.77, -0.77, -1.5,

];
const bgPlaneColors = [
    0, 0.576, 1,
    0, 0.882, 1,
    0, 0.267, 1,
    0, 0.576, 1,
];

//set water mesh data and add to scene
bgPlaneGeometry.setIndex( bgPlaneIndices );
bgPlaneGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute(bgPlanePositions,3) );
bgPlaneGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute(bgPlaneColors,3) );
const bgPlaneMesh = new THREE.Mesh( bgPlaneGeometry, vertMat );
scene.add( bgPlaneMesh );

document.body.addEventListener( 'mousemove', onMouseMove );
document.body.addEventListener( 'touchmove', onTouchMove );
window.addEventListener("resize", resizedWindow);


setInterval(queueRender, msPerFrame);
animate(scene, camera);

function queueRender() {
    readyToRender = true;
}            

function pointerMove(x, y) {
    const indX = Math.floor((x / wX) * xPoi);
    const indY = Math.floor((1 - y / wY) * yPoi);
    
    for (let i = -(pointerSize-1); i < pointerSize; i++) {
        const xtemp = i + indX;
        for (let j = -(pointerSize-1); j < pointerSize; j++) {
            const ytemp = j + indY;
            if (0 < xtemp && xtemp < xSeg && 0 < ytemp && ytemp < ySeg) {
                const indtemp = xtemp + (ytemp * xPoi);
                prev[indtemp] += pointerStrength * (pointerSize - (Math.abs(i) + Math.abs(j))) / pointerSize;
            }
        }
    }
}

function onTouchMove(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
    for(let i = 0; i < e.touches.length; i++) {
        pointerMove(e.touches[i].clientX, e.touches[i].clientY);
    }
}

function onMouseMove(e) {
    pointerMove(e.clientX, e.clientY)
}

function rippleAnimate() {
    for (let x = 1; x < xPoi; x++) {
        for (let y = 1; y < yPoi; y++) {
            curr[x + (y * xPoi)] = (prev[(x-1) + y * xPoi] + 
                                        prev[(x+1) + y * xPoi] + 
                                        prev[x + (y+1) * xPoi] + 
                                        prev[x + (y-1) * xPoi]) / 2 - curr[x + (y * xPoi)];
            curr[x + (y * xPoi)] = curr[x + (y * xPoi)] * damping;
            curr[x + (y * xPoi)] = isNaN(curr[x + (y * xPoi)]) ? 0 : curr[x + (y * xPoi)];
        }
    }

    for (let i = 0; i < xPoi*yPoi; i++) {
        normalsA.setY(i,curr[i]);
        normalsA.setX(i,curr[i]);
    }

    for (let i = 0; i < xPoi*yPoi; i++) {
        const temp = prev[i];
        prev[i] = curr[i];
        curr[i] = temp;
    }

    normalsA.needsUpdate = true;
}

//frame update
function animate() {
    requestAnimationFrame( animate );

    // torusMesh.rotation.x += 0.01;
    // torusMesh.rotation.y += 0.01;
    
    if (readyToRender) {
        rippleAnimate()
        renderer.render( scene, camera );
        readyToRender = false;
    }
    
    // wXP.innerHTML = "wX: " + wX;
    // wYP.innerHTML = "wY: " + wY;
    // ySegP.innerHTML = "ySeg: " + ySeg;
    // xSegP.innerHTML = "xSeg: " + xSeg;
    // yPoiP.innerHTML = "yPoi: " + yPoi;
    // xPoiP.innerHTML = "xPoi: " + xPoi;
    // totalVerticesP.innerHTML = "totalVertices: " + counter;
    // wXYgcdP.innerHTML = "wXYgcd: " + wXYgcd;
    // AspectP.innerHTML = "Aspect: " + wX/wXYgcd + ":" + wY/wXYgcd;
}

function resizedWindow() {
    wX = window.innerWidth;
    wY = window.innerHeight;
    wXYgcd = gcd(wX, wY);
    renderer.setSize(wX, wY);
}

function gcd (a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}

function aspectScaleSolve(a,b,c) {
    const tempA = a;
    a = tempA * b * 2;
    b = tempA + b;
    c = -c;
    return (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
}


// <!-- <canvas id="waterCanvas" style="position: fixed; top: 0;"></canvas> -->
//         <!-- <div style="display: flex; flex-direction: column; position: fixed; top: 0; color: white;">
//             <p id="wXP"></p>
//             <p id="wYP"></p>
//             <p id="xSegP"></p>
//             <p id="ySegP"></p>
//             <p id="xPoiP"></p>
//             <p id="yPoiP"></p>
//             <p id="totalVerticesP"></p>
//             <p id="wXYgcdP"></p>
//             <p id="AspectP"></p>
//         </div> -->