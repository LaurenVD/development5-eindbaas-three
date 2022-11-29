import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { isPowerOfTwo } from 'three/src/math/MathUtils';



const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
      renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
      document.body.appendChild( renderer.domElement );

      //add ambient light
      const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
      scene.add( ambientLight );

      //add directional light
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      scene.add( directionalLight );

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
        gltf.scene.position.set(0,0,0);
        scene.add( gltf.scene );
        //add function to button randomize
        document.getElementById("random").addEventListener("click", function(){
          gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
              child.material.color.setHex( Math.random() * 0xffffff );
            }
          } );

        });

        document.getElementById("flavor").addEventListener("change", function(e){
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
        document.getElementById("sprinkles").addEventListener("change", function(e){
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
        document.getElementById("file").addEventListener("change", function(e){
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
          //create a new material with the texture
          const material = new THREE.MeshBasicMaterial({map: texture});
          //create a new plane geometry
          const geometry = new THREE.PlaneGeometry( 1, 1, 1 );
          //create a new mesh with the geometry and material
          const plane = new THREE.Mesh( geometry, material );
          //add the plane to the scene
          scene.add( plane );
          //set the plane position
          plane.position.set(1,1.76,0);
          //set the plane scale
          plane.scale.set(0.5,0.5,0.5);
          plane.lookAt(gltf.scene.position);
          plane.rotateX(Math.PI/2);
          plane.rotateZ(Math.PI/2);
          plane.rotateY(Math.PI);
          //show image on other side of plane

          //dont show black background on plane
          plane.material.transparent = true;

        }
        );
        
          
      }, undefined, function ( error ) {
        console.error( error );
      } );

      

      //increase canvas size when window is resized
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      });
      camera.position.z = 5;



      //add orbit controls
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = true;
      controls.update();

			function animate() {
				requestAnimationFrame( animate );

				renderer.render( scene, camera );
			};

      const apiURL = 'https://donutello-backend.onrender.com/api/v1/donuts';

      //save donut gltb model to backend
      const saveButton = document.getElementById('button');
      saveButton.addEventListener('click', function() {
        const donut = scene.getObjectByName('donut');
        //get color from array based on dropdown value
        
        
        //get screenshot of donut
        console.log(renderer.domElement);
        const screenshot = renderer.domElement.toDataURL("image/webp");
        console.log(screenshot);
        //save input as name
        const name = document.getElementById('name').value;
        console.log(name);

        //get rgb value from dropdown
        const flavor = document.getElementById('flavor').value;


        //send data to backend
        const data = {
          name: name,
          glaze: flavor,
          image: screenshot,
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