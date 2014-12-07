  #version 330 core


  //GPU Raytracer:
  //1
  //TODO:
  //    gl_FragCoord stores window space point.
    //  Need to pass in viewing transformation of camera.  Can start by setting default for these.
  //    Also need to pass in size of canvas
  //start out with camera at a fixed point


  //in vec4 gl_FragCoord;

  //    layout(origin_upper_left) in vec4 gl_FragCoord;

  uniform int sceneType;
  out vec4 fragColor;
  
  float width = 500.;

  vec4 camPos = vec4(50.,50.,50.,1.);
  float far = 30.;
  float aspectRatio = 1.;
  float heightAngle = 2.*atan(1.,(2.*far));

  vec4 look = vec4(-camPos.xyz, 0.);
  vec4 up = vec4(0.,1.,0.,0.);


  float tan_h = tan(heightAngle/2.);
  float height = 2.*far *tan_h;
  float tan_w = (aspectRatio*height) / (2. * far);


  mat4 camScale = transpose(mat4(1./(far*tan_w), 0. ,             0.,        0.,
			    0.,                   1./(far*tan_h), 0.,        0.,
			    0.,                   0.,              1./far,   0.,
			    0.,                   0.,              0.,        1.));

  mat4 camTranslate = transpose(mat4(1,0,0,-camPos.x,
					  0,1,0,-camPos.y,
					  0,0,1,-camPos.z,
					  0,0,0,1));
  vec3 w = -normalize(vec3(look.x,look.y,look.z));
  vec3 v = normalize(vec3(up.x,up.y,up.z) - (dot(vec3(up.x,up.y,up.z), w)*w));
  vec3 u = normalize(cross(v,w));
  mat4 camRotate = transpose(mat4(u.x,  u.y,  u.z,  0,
				  v.x,  v.y,  v.z,  0,
				  w.x,  w.y,  w.z,  0,
				  0,    0,    0,    1));

  mat4 view = camScale*camRotate*camTranslate;

  struct Material
  {
      vec3 cDiffuse;
      vec3 cSpecular;
      vec3 cAmbient;
      vec3 cReflection;
      vec3 cRefraction;
      float shininess;

  };
  struct Primitive
  {
      int type; //CUBE = 0, CONE = 1, CYLINDER = 2, SPHERE = 3
      mat4 transformation;

      /*
      vec3 pos;
      //for rotation:
      vec3 rotation;
      float angle;

      vec3 scale;*/
      Material mat;

  };
  struct Light
  {
      int type; // POINT = 0, DIRECTIONAL = 1;
      vec3 pos;
      vec3 direction;
      vec3 color;
      vec3 function;
  }

  //Structure to store the objects in the scene
  struct Scene
  {
    Primitive objects[4];
    int n_objects;
    float cAmbientCoeff;
    float cDiffuseCoeff;
    float cSpecularCoeff;
    float cTransparencyCoeff;
    
    Light lights[4];
    int n_lights

  };


  //structure to store t and normals and 
  struct intersectionDetails
  {
    float t;
    vec3 normalObject;
    int primitiveIndex;  
  };

  //Global variable to store the nearest objects details
  intersectionDetails nearest;
  //Global variable to store the current scene
  Scene scene;

/****************************************************************************************************************************/
//Functions that create the different scenes:

//Scene 1 is a simple white ball centered at the origin with two light : one blue and one red.
void createScene1(){

    //Number of primitive in the scene scene
    scene.n_objects = 1;   
    //Set primitives in the scene scene
    scene.objects[0].type = 3;
    scene.objects[0].transformation = mat4(1.0);
    scene.objects[0].mat.cDiffuse = vec3(1.0);
    scene.objects[0].mat.cAmbient = vec3(1.0);
    scene.objects[0].mat.cSpecular = vec3(0.0);
    scene.objects[0].mat.cReflection = vec3(0.0);
    scene.objects[0].mat.cRefraction = vec3(0.0);
    scene.objects[0].mat.shininess = 1.0;
    scene.cAmbientCoeff = 0.5;
    scene.cDiffuseCoeff = 0.5;
    scene.cSpecularCoeff = 0.5;
    
    
    //Lights:
    scene.lights[0].type = 0; //point light
    scene.lights[0].pos = vec3(-10., 10., 0.);
    scene.lights[0].color = vec3(1., 0., 0.);
    scene.lights[0].function = vec3(1., 0., 0.);
    
    scene.lights[1].type = 0; //point light
    scene.lights[1].pos = vec3(10., 10., 0.);
    scene.lights[1].color = vec3(0., 0., 1.);
    scene.lights[1].function = vec3(1., 0., 0.);
    scene.n_lights = 2;
}







/****************************************************************************************************************************/


  vec4 generateRay(){

      vec4 d = vec4(0.);
      vec4 p_film = vec4((2.*gl_FragCoord.x / 500.)  - 1., 1. - (2.*gl_FragCoord.y / 500.), -1, 0.);

      vec4 p_world = inverse(view)*p_film;

      d = normalize(p_world - camPos);

      return d;
  }


  void setIntersectionDetails(float newT, vec3 normal, int index){


      if(newT >= 0){
	  if(newT < nearest.t || nearest.t < 0){

	      nearest.t = newT;
	      nearest.normalObject = normal;
	      nearest.primitiveIndex = index;
	  }

      }

  }


  //ALL INTERSECTS DEAL IN OBJECT SPACE
  void intersectCube(vec3 P, vec3 d, int index){
    

      float tx1 = (0.5 - P.x) / d.x;
      float tx2 = (0.5 + P.x) / (-d.x);
      vec3 normal = vec3(0.);
      vec3 point = P + tx1*d;
      if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){
	  normal = vec3(1.0f, 0.0f, 0.0f);
	  setIntersectionDetails(tx1, normal, index);
	  
	  }

      point = P + tx2*d;
      if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

	  normal = vec3(-1.0f, 0.0f, 0.0f);
	  setIntersectionDetails(tx2, normal, index);

      }


      float ty1 = (0.5 - P.y) / d.y;
      float ty2 = (0.5 + P.y) / (-d.y);

      point = P + ty1*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

	  normal = vec3(0.0f, 1.0f, 0.0f);
	  setIntersectionDetails(ty1, normal, index);
      }
      point = P + ty2*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

	  normal = vec3(0.0f, -1.0f, 0.0f);
	  setIntersectionDetails(ty2, normal, index);


      }


      float tz1 = (0.5 - P.z) / d.z;
      float tz2 = (-0.5 - P.z) / d.z;

      point = P + tz1*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

	  normal = vec3(0.0f, 0.0f, 1.0f);
	  setIntersectionDetails(tz1, normal, index);

      }
      point = P + tz2*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

	  normal = vec3(0.0f, 0.0f, -1.0f);
	  setIntersectionDetails(tz2, normal, index);
      }

    

  }
  void intersectCone(vec3 P, vec3 d, int index){
    


      //Body:

      float a = pow(d.x,2) + pow(d.z, 2) - (0.25 * pow(d.y, 2));
      float b = 2*P.x*d.x + 2*P.z*d.z - (0.5*P.y*d.y) + (0.25*d.y);
      float c = pow(P.x,2) + pow(P.z, 2) - (0.25 * pow(P.y, 2)) + (0.25*P.y) - (1./16.);

      float disc = pow(b,2) - (4*a*c);
      if(disc >= 0){
      

      float t1 = (-b + sqrt(disc)) / (2*a);
      float t2;
      if(disc ==0)
	  t2 = t1;
      else
	  t2 = (-b - sqrt(disc)) / (2*a);

      vec3 point = P+ t1*d;
      vec3 normal = vec3(0.);
      //Check that it's within y bounds
      if(P.y + t1*d.y <= 0.5 && P.y + t1*d.y >= -0.5){

	normal = normalize(vec3(2.f*point.x, 0.25f*(1.f - 2.f*point.y), 2.f*point.z));
	setIntersectionDetails(t1, normal, index);

      }
      point = P+ t2*d;

      if(P.y + t2*d.y <= 0.5 && P.y + t2*d.y >= -0.5){

	  normal = normalize(vec3(2.f*point.x, 0.25f*(1.f - 2.f*point.y), 2.f*point.z));
	  setIntersectionDetails(t2, normal, index);

      }
    

      //Cap

      float t3 = (-0.5 - P.y) / d.y;
      vec3 pointCap = P+ t3*d;

      //Check that it's within radius bounds
      if(pow(pointCap.x, 2) + pow(pointCap.z, 2.) <= pow(0.5,2.)){
	  normal = vec3(0.0f, -1.0f, 0.0f);
	  setIntersectionDetails(t2, normal, index);
      }
      }

      
  }
  void intersectCylinder(vec3 P, vec3 d, int index){
    
      float a = pow(d.x,2.) + pow(d.z, 2.);
      float b = 2*P.x*d.x + 2*P.z*d.z;
      float c = pow(P.x,2.) + pow(P.z, 2.) - pow(0.5,2.);

      float disc = pow(b,2.) - (4*a*c);
      if(disc >= 0){
	

      float t1 = (-b + sqrt(disc)) / (2*a);
      vec3 normal = vec3(0.);
      vec3 point = P + t1*d;
      
      if(point.y >= -0.5 && point.y <= 0.5){
	  normal = normalize(vec3(2.f*point.x, 0.0, 2.*point.z));

	  setIntersectionDetails(t1, normal, index);
	  }
      float t2 = (-b - sqrt(disc)) / (2*a);
      point = P + t2*d;
      if(point.y >= -0.5 && point.y <= 0.5){
	  normal = normalize(vec3(2.*point.x, 0.0f, 2.*point.z));

	  setIntersectionDetails(t2, normal, index);
      }

      //caps:


      float t3 = (0.5 - P.y) / d.y;
      float t4 = (-0.5 - P.y) / d.y;

      vec3 pointCap = P + t3*d;
      if(pow(pointCap.x,2.) + pow(pointCap.z,2.) <= (pow(0.5,2.))){
	  normal = vec3(0.0, 1., 0.0);
	  setIntersectionDetails(t3, normal, index);
	  
	  }

      pointCap = P + t4*d;
      if(pow(pointCap.x,2.) + pow(pointCap.z,2.) <= (pow(0.5,2.))){
	  normal = vec3(0.0,-1. , 0.0);
	  setIntersectionDetails(t3, normal, index);
	  
	  }
	  }
  }
  void intersectSphere(vec3 P, vec3 d, int index){

      float a = pow(d.x,2.) + pow(d.y,2.) + pow(d.z,2.);
      float b = (2*P.x*d.x + 2*P.y*d.y + 2*P.z*d.z);
      float c = pow(P.x,2.) + pow(P.y,2.) + pow(P.z,2.) - pow(0.5, 2.);

      float disc = pow(b,2.) - (4*a*c);
      if(disc >= 0){
      

      
      float t1 = (-b + sqrt(disc)) / (2*a);
      float t2 = (-b - sqrt(disc)) / (2*a);
      vec3 point = P + t1*d;
      vec3 normal = normalize(2.f*(vec4(point,0.f))).xyz;

      
      setIntersectionDetails(t1, normal, index);
      
      point = P + t2*d;
      normal = normalize(2.f*(vec4(point,0.f))).xyz;
      
      setIntersectionDetails(t2, normal, index);
      }
  }


    void intersect(int type, vec3 p_object, vec3 d_object, int index){


      if(type == 0){
	  intersectCube(p_object, d_object, index);

      }
      else if(type ==1){
	  intersectCone(p_object, d_object,index);

      }
      else if(type == 2){
	  intersectCylinder(p_object, d_object,index);

      }
      else if(type == 3){
	  intersectSphere(p_object, d_object,index);

      }
  }

void main(){

    //Generate the ray in the worls space corresponding to the current screen space pixel   
    vec4 d_world = generateRay();


    createScene1();









    /* First test - ambient light only, 1 object:

    //Create a scene with one sphere
    Scene sphere;
    //Number of primitive in the sphere scene
    sphere.n_objects = 1;   
    //Set primitives in the sphere scene
    sphere.objects[0].type = 2;
    sphere.objects[0].transformation = mat4(1.0);
    sphere.objects[0].mat.cDiffuse = vec3(1.0);
    sphere.objects[0].mat.cAmbient = vec3(1.0);
    sphere.objects[0].mat.cSpecular = vec3(0.0);
    sphere.objects[0].mat.cReflection = vec3(0.0);
    sphere.objects[0].mat.cRefraction = vec3(0.0);
    sphere.objects[0].mat.shininess = 1.0;
    sphere.cAmbientCoeff = 0.5;
    sphere.n_lights = 0;
    

    //loop across objects to find intersection
    nearest.t = -1.;
    for(int i=0; i<sphere.n_objects; ++i){
      
      mat4 transInverse = inverse(sphere.objects[i].transformation);
      //Take p_world and d_world to object space
      vec4 p_object = transInverse*camPos;
      vec4 d_object = transInverse*d_world;

      //Compute the intersection with the object
      intersect(sphere.objects[i].type, p_object.xyz, d_object.xyz, i);
    
    }
    fragColor = vec4(0.);
    if(nearest.t >= 0)
      fragColor.rgb = fragColor.rgb + sphere.cAmbientCoeff * sphere.objects[nearest.primitiveIndex].mat.cAmbient; 
      */

    nearest.t = -1.;
    for(int i=0; i<scene.n_objects; ++i){
      
      mat4 transInverse = inverse(scene.objects[i].transformation);
      //Take p_world and d_world to object space
      vec4 p_object = transInverse*camPos;
      vec4 d_object = transInverse*d_world;

      //Compute the intersection with the object
      intersect(scene.objects[i].type, p_object.xyz, d_object.xyz, i);
    
    }



    fragColor = vec4(0.);
    //Lighting for the pixel based on the nearest intersection

    if(nearest.t >= 0){
        vec3 normalWorld = normalize(transpose(mat3(inverse(sphere.objects[nearest.primitiveIndex].transformation))) * nearest.normalObject);
        vec4 intersectPoint = camPos + nearest.t*d_world;
        vec3 surfaceToEye = normalize(camPos - intersectPoint);


        float f_att = 1.;
        float distToLight;
        for(int l=0; l < scene.n_lights; l++){

            vec3 surfaceToLightFull = scene.lights[l].pos - intersectPoint.xyz;
            vec3 surfaceToLight = normalize(surfaceToLightFull);

            vec3 reflectedVector = normalize(2.*normWorld*(dot(normWorld, surfaceToLight)) - surfaceToLight);

            //attenuation for point lights:
            if(scene.lights[l].type == 0){ //Point light
                distToLight = surfaceToLightFull.x*surfaceToLightFull.x + surfaceToLightFull.y*surfaceToLightFull.y + surfaceToLightFull.z*surfaceToLightFull.z;
                f_att = min(1., 1./(scene.lights[l].function.x + scene.lights[l].function.y*sqrt(distToLight) + scene.lights[l].function.z*distToLight));
            }
            vec3 diffuseColor =scene.cDiffuseCoeff*scene.objects[nearest.primitiveIndex].mat.cDiffuse*max(0., dot(surfaceToLight, normalWorld));
            //TODO: calculate specular highlight:
            vec3 specularColor = scene.cSpecularCoeff*scene.objects[nearest.primitiveIndex].mat.cSpecular*
                                    pow(max(0., dot(reflectedVector, surfaceToLight)), scene.objects[nearest.primitiveIndex].mat.shininess);


            fragColor.rgb += clamp(f_att*scene.lights[l].color*(diffuseColor + specularColor), vec3(0.), vec3(1.));


        }



        
        fragColor.rgb += scene.cAmbientCoeff * scene.objects[nearest.primitiveIndex].mat.cAmbient; 

    }
    fragColor = clamp(fragColor.rgb, vec3(0.), vec3(1.));
      
}


