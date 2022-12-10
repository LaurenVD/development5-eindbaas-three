import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { isPowerOfTwo } from 'three/src/math/MathUtils';



const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      //set camera view further from donut to see the whole donut
      camera.position.z = 5;
      camera.position.y = 3;


      //set background color to #E72C70
      renderer.setClearColor(0xE72C70, 1);

      //add ambient light
      const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
      scene.add( ambientLight );

      //add directional light
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      scene.add( directionalLight );

      //add spotlight to donut
      const spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
      spotLight.position.set( 0, 2, 2 );
      spotLight.castShadow = true;
      scene.add( spotLight );

      //Make donut look glossy
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      spotLight.shadow.camera.near = 500;
      spotLight.shadow.camera.far = 4000;
      spotLight.shadow.camera.fov = 30;

      //decrease spotlight intensity
      spotLight.intensity = 0.5;



      //create an array with rgb values for each dropdown option
      const colors = [
        //vanilla
        [249,229,188],
        //chocolate
        [123,63,0],
        //strawberry
        [252,90,141],
      ];

      //import gltf model from /assets
      const loader = new GLTFLoader();
      loader.load( '/assets/gltf/donut.glb', function ( gltf ) {
        gltf.scene.scale.set(25,25,25);
        //set donut to 60% of canvas width
        //put donut at the bottom of the canvas
        gltf.scene.position.set(0,0,0);
        //move gltf y position down on mobile
        scene.add( gltf.scene );

        document.getElementById("configurator__flavor").addEventListener("change", function(e){
          //get the value of the dropdown menu
          const flavorColor = e.target.value;
          //select glaze from model
          const glaze = gltf.scene.getObjectByName("glaze");
          //if dropdown is chocolate, set color to chocolate
          if(flavorColor == "chocolate"){
            //set glaze rgb value to colors array chocolate
            glaze.material.color.setRGB(colors[1][0]/255,colors[1][1]/255,colors[1][2]/255);
          }
          //if dropdown is vanilla, set color to vanilla
          if(flavorColor == "vanilla"){
            //set glaze rgb value to colors array vanilla
            glaze.material.color.setRGB(colors[0][0]/255,colors[0][1]/255,colors[0][2]/255);
          }
          //if dropdown is strawberry, set color to strawberry
          if(flavorColor == "strawberry"){
            //set glaze rgb value to colors array strawberry
            glaze.material.color.setRGB(colors[2][0]/255,colors[2][1]/255,colors[2][2]/255);
          }
            
        });
        
        //change topping color according to sprinkles dropdown
        document.getElementById("configurator__sprinkles").addEventListener("change", function(e){
          //get the value of the dropdown menu
          const sprinklesColor = e.target.value;
          //select glaze from model
          const sprinkles = gltf.scene.getObjectByName("topping");
          //if dropdown is chocolate, set color to chocolate
          if(sprinklesColor == "chocolate"){
            //set glaze rgb value to colors array chocolate
            //set sprinkles to visible
            sprinkles.visible = true;
            sprinkles.material.color.setRGB(colors[1][0]/255,colors[1][1]/255,colors[1][2]/255);
          }
          //if dropdown is rainbow, set color to rainbow
          if(sprinklesColor == "sugar"){
            //set glaze rgb to white color
            sprinkles.visible = true;
            sprinkles.material.color.setRGB(1,1,1);

          }
          //if dropdown is crystal, set color to crystal
          if(sprinklesColor == "crystal"){
            //set glaze rgb to blue color
            sprinkles.visible = true;
            sprinkles.material.color.setRGB(0,0,1);
          }
          //if dropdown is none, don't show sprinkles
          if(sprinklesColor == "none"){
            //set glaze rgb to very light blue color
            sprinkles.visible = false;
          }

        });

        //upload image to texture and create a plane on the donut to display the image
        document.getElementById("configurator__file").addEventListener("change", function(e){
          //get the file from the input
          const file = e.target.files[0];
          //create a new image
          const img = new Image();
          //set the image src to the file
          img.src = URL.createObjectURL(file);
          //create a new texture
          const texture = new THREE.Texture(img);
          //load the texture
          texture.needsUpdate = true;
          //make transparent based on alpha channel
          texture.minFilter = THREE.LinearFilter;

          //create a new material with the texture
          const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
          //create a new plane geometry
          const geometry = new THREE.PlaneGeometry( 1, 1, 32 );
          //create a new mesh with the geometry and material
          const plane = new THREE.Mesh( geometry, material );
          //set the plane position to the donut
          plane.position.set(0,1.77,1.2);
     
          //rotate the plane so it's facing up
          plane.rotation.x = -Math.PI/2;
          //set the plane scale to the donut
          plane.scale.set(0.5,0.5,0.5);
          //add the plane to the scene
          scene.add( plane );
          //show logo on both sides
          plane.material.side = THREE.DoubleSide;
        }
        );
          
      }, undefined, function ( error ) {
        console.error( error );
      } );

      //move donut up on screen in mobile
      if (window.innerWidth < 768) {
        camera.position.z = 50;
        //zoom out on mobile
        camera.zoom = 0.8;
        camera.updateProjectionMatrix();

      }

      //increase canvas size when window is resized
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      });

      //add orbit controls
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = true;
      controls.update();

      //restrict zoom in and out
      controls.minDistance = 3;
      controls.maxDistance = 7;


			function animate() {
				requestAnimationFrame( animate );
        //rotate spotlight around donut
        spotLight.position.x = Math.sin( Date.now() * 0.0007 ) * 3;
        spotLight.position.z = Math.cos( Date.now() * 0.0007 ) * 3;

        //get donut, glaze and sprinkles from scene
        const donut = scene.getObjectByName('donut');
        const glaze = scene.getObjectByName('glaze');
        const sprinkles = scene.getObjectByName('topping');
        //get plane from scene
        const plane = scene.getObjectByName('plane');

        //rotate donut, glaze and sprinkles around donut axis
        donut.rotation.y += 0.01;
        glaze.rotation.y += 0.01;
        sprinkles.rotation.y += 0.01;

        //rotate plane around donut axis
        controls.update();
				renderer.render( scene, camera );
			};
      const apiURL = 'https://eindbaas-donutello-node.onrender.com/api/v1/donuts';

      //save donut gltb model to backend
      const saveButton = document.getElementById('input__button');
      saveButton.addEventListener('click', function() {

        //show donut opgeslagen in input__saved
        const saved = document.getElementById('input__saved');
        saved.innerHTML = "Donut opgeslagen!";

          
        //get screenshot of donut
        console.log(renderer.domElement);
        const screenshot = renderer.domElement.toDataURL("image/webp");
        //save input as name
        const name = document.getElementById('input__name').value;
        console.log(name);

        //get rgb value from dropdown
        const flavor = document.getElementById('configurator__flavor').value;

        //get email from input
        const mail = document.getElementById('input__email').value;


        //send data to backend
        const data = {
          name: name,
          glaze: flavor,
          sprinkles: configurator__sprinkles.value,
          image: screenshot,
          email: mail,

        };
        fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      });

			animate();