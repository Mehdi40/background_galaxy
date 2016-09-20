// Defining some variables we'll be using later
var camera;
var scene;
var renderer;
var clock;
var deltaTime;
var particleSystem;
var vitesse = 100;
var opacity = 0;

// Launching the script
init();
animate();


// Main function, creating the scene, the camera, the light, etc.
function init() {
 
    clock = new THREE.Clock(true);
     
    // We're creating the scene, the base of the project
    scene = new THREE.Scene();
    
    // We're adding a camera, so we can... see
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    
    // And we're finally placing the camera in this scene
    camera.position.z = -50;
    
    // We're creating a light, setting its position and adding it to the scene
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, -1, 1).normalize();
    scene.add(light);
 
 
    // Now we're creating the particle system. This will be the stars. And we're adding it to the scene.
    particleSystem = createParticleSystem();
    scene.add(particleSystem);

    // The renderer is the thing that will make us able to see the whole scene. Basically, we're creating it, setting its size, its color, and adding it into our page. (div with id = bg)
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1F3A93, opacity);
    document.getElementById('bg').appendChild(renderer.domElement);
    
    window.addEventListener('resize', onWindowResize, false);
    
    // The scene can be seen
    render();
}
 
// Function that will animate the whole scene
function animate() {
    deltaTime = clock.getDelta();
   
    animateParticles();
    
    render();
    requestAnimationFrame(animate);
}
 
// Function that will render the whole scene
function render() {
    renderer.render(scene, camera);
}
 
// Function that will rule the resize of the window (so we won't have any problems with the size of the scene)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

// The most interesting thing : The function that generates the particles
function createParticleSystem() {

    // We'll be creating 5000 particles
    var particleCount = 5000,
        particles = new THREE.Geometry();
    
    // The loop that'll create the particles one by one, placing theme randomly thanks to "Math.random()" on the three axes (X, Y, Z)
    // This will improve 'realism', as all the particles won't be deplacing from the same Z point. This will increase 'perspective'.
    for (var p = 0; p < particleCount; p++) {
        var x = Math.random() * 800 - 50,
            y = Math.random() * 800 - 50,
            z = Math.random() * 800 - 650,
            particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
    }
    
    // We're making them visible by adding a material... Basically that's just a color : white.
    var particleMaterial = new THREE.PointsMaterial(
            {color: 0xFFFFFF, 
             size: 1,
             blending: THREE.AdditiveBlending,
             transparent: true,
            });
    
    // And we're adding this to the variable we were using earlier
    particleSystem = new THREE.Points(particles, particleMaterial);
 
    return particleSystem;  
}

// Now, we want our particles to move !
function animateParticles() {
    var vertices = particleSystem.geometry.vertices;
    
    // The loop makes everything. If the particles comes further than 0, in the Z axe, they'll be placed randomly in the three axes.
    // That's not TRUE random, but still.
    for(var i = 0; i < vertices.length; i++) {
        var vertice = vertices[i];
        if (vertice.z > 0) {
            vertice.z = Math.random() * 400 - 800;
            
            vertice.y = Math.random() * 400 - 200;
            vertice.x = Math.random() * 800 - 400;
        }else if(vertice.z < -700){
            vertice.z = Math.random() * 1;
            
            vertice.y = Math.random() * 400 - 200;
            vertice.x = Math.random() * 800 - 400;
        }
        
        // That's the speed the particles are going forwards
        vertice.z = vertice.z + (vitesse * deltaTime);
    }
    particleSystem.geometry.verticesNeedUpdate = true;
    
    particleSystem.translateZ -= 100 * deltaTime;
     
}

// I added a small function that'll calculate the distance between our cursor and the center of the page.
// The more you go to the center of the page, the slower the particles will move.
// The more you go to the borders of the page, the faster the particles will move.
function accelerateTime(event){
    var centerX = window.innerWidth/2,
        centerY = window.innerHeight/2,
        maxX = window.innerWidth,
        maxY = window.innerHeight,
        cursorX = event.clientX,
        cursorY = event.clientY;
    
    var distance = Math.floor(Math.sqrt(Math.pow((cursorX - centerX),2) + Math.pow((cursorY - centerY),2)));
    var distanceMax = Math.floor(Math.sqrt(Math.pow((maxX - centerX),2) + Math.pow((maxY - centerY),2)));
    
    var pourcentage = (100 * distance)/distanceMax;
    var vitesseR = (100 * pourcentage) / 100;
    vitesse = vitesseR;
    opacity = distance / distanceMax;
}
