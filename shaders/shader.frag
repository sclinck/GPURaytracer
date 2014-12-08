  #version 330 core


  //GPU Raytracer:
  //1
  //TODO:
  //    gl_FragCoord stores window space point.
    //  Need to pass in viewing transformation of camera.  Can start by setting default for these.
  //    Also need to pass in size of canvas
  //start out with camera at a fixed point


  
  #define PI 3.14159265

      layout(origin_upper_left) in vec4 gl_FragCoord;

      
  uniform sampler2D tex;
  uniform int textureWidth;
  uniform int textureHeight; 
  uniform int sceneType;
  
  out vec4 fragColor;
  
  float width = 500.;
  
  int numRecursions = 5;
  

  vec4 camPos = vec4(0.,0.,50.,1.);
  float far = 30.;
  float aspectRatio = 1.;
  float heightAngle = 2.*atan(1.,(2.*far));

  vec4 look = vec4(-camPos.xyz, 0.);
  vec4 up = vec4(0.,1.,0.,0.);


  float tan_h = tan(heightAngle/2.);
  float height = 2.*far *tan_h;
  float tan_w = (aspectRatio*height) / (2. * far);
  float radius = 0.5;


  mat4 camScale = transpose(mat4(1./(far*tan_w), 0. ,             0.,        0.,
			    0.,                   1./(far*tan_h), 0.,        0.,
			    0.,                   0.,              1./far,   0.,
			    0.,                   0.,              0.,        1.));

  mat4 camTranslate = transpose(mat4(1.,0.,0.,-camPos.x,
					  0.,1.,0.,-camPos.y,
					  0.,0.,1.,-camPos.z,
					  0.,0.,0.,1.));
  vec3 w = -normalize(vec3(look.x,look.y,look.z));
  vec3 v = normalize(vec3(up.x,up.y,up.z) - (dot(vec3(up.x,up.y,up.z), w)*w));
  vec3 u = normalize(cross(v,w));
  mat4 camRotate = transpose(mat4(u.x,  u.y,  u.z,  0.,
				  v.x,  v.y,  v.z,  0.,
				  w.x,  w.y,  w.z,  0.,
				  0.,    0.,    0.,    1.));

  mat4 view = camScale*camRotate*camTranslate;

  struct Material
  {
      vec3 cDiffuse;
      vec3 cSpecular;
      vec3 cAmbient;
      vec3 cReflection;
      vec3 cRefraction;
      float shininess;
      float blend;
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
  };

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
    int n_lights;

  };


  //structure to store t and normals and 
  struct intersectionDetails
  {
    float t;
    vec3 normalObject;
    int primitiveIndex;  
  };

  //Global variable to store the nearest objects details
//  intersectionDetails nearest;
  //Global variable to store the current scene
  Scene scene;

/****************************************************************************************************************************/
//Functions that create the different scenes:

//Scene 1 is a simple white ball centered at the origin with two light : one blue and one red.
void createScene1(){

    //Number of primitive in the scene scene
    scene.n_objects = 1;   
    //Set first  primitives in the scene scene
    scene.objects[0].type = 3;
    scene.objects[0].transformation = mat4(1.0);
    scene.objects[0].mat.cDiffuse = vec3(1.0);
    scene.objects[0].mat.cAmbient = vec3(1.0);
    scene.objects[0].mat.cSpecular = vec3(1.0);
    scene.objects[0].mat.cReflection = vec3(0.0);
    scene.objects[0].mat.cRefraction = vec3(0.0);
    scene.objects[0].mat.shininess = 40.0;
    scene.objects[0].mat.blend = 0.5;
    scene.cAmbientCoeff = 0.5;
    scene.cDiffuseCoeff = 0.5;
    scene.cSpecularCoeff = 0.5;

    //Set second primitives in the scene scene
    /*scene.objects[1].type = 3;
    
    scene.objects[1].transformation = mat4(1.0);
    scene.objects[1].transformation[3][1] = -50.;
    scene.objects[1].transformation[3][0] = 50.;

    
    scene.objects[1].mat.cDiffuse = vec3(1.0);
    scene.objects[1].mat.cAmbient = vec3(1.0);
    scene.objects[1].mat.cSpecular = vec3(1.0);
    scene.objects[1].mat.cReflection = vec3(0.0);
    scene.objects[1].mat.cRefraction = vec3(0.0);
    scene.objects[1].mat.shininess = 40.0;*/
    
    
    //Lights:
    scene.lights[0].type = 0; //point light
    scene.lights[0].pos = vec3(-10., 10., 0.);
    scene.lights[0].color = vec3(1., 0., 0.);
    scene.lights[0].function = vec3(1., 0., 0.);
    
    scene.lights[1].type = 0; //point light
    scene.lights[1].pos = vec3(10., 10., 0.);
    scene.lights[1].color = vec3(0., 0., 1.);
    scene.lights[1].function = vec3(1., 0., 0.);
    
    
    scene.lights[2].type = 0; //point light
    scene.lights[2].pos = vec3(3., -10., 0.);
    scene.lights[2].color = vec3(1., 1., 1.);
    scene.lights[2].function = vec3(1., 0., 0.);
    scene.n_lights = 3;
}







/****************************************************************************************************************************/


  vec4 generateRay(){

      vec4 d = vec4(0.);
      vec4 p_film = vec4((2.*gl_FragCoord.x / 100.)  - 1., 1. - (2.*gl_FragCoord.y / 100.), -1, 0.);

      vec4 p_world = inverse(view)*p_film;

      d = normalize(p_world - camPos);

      return d;
  }


  void setIntersectionDetails(float newT, vec3 normal, inout intersectionDetails  nearest, int index){


      if(newT >= 0){
	  if(newT < nearest.t || nearest.t < 0){

	      nearest.t = newT;
	      nearest.normalObject = normal;
	      nearest.primitiveIndex = index;
	  }

      }

  }


  //ALL INTERSECTS DEAL IN OBJECT SPACE
  void intersectCube(vec3 P, vec3 d, inout intersectionDetails  nearest, int index){
    

      float tx1 = (0.5 - P.x) / d.x;
      float tx2 = (0.5 + P.x) / (-d.x);
      vec3 normal = vec3(0.);
      vec3 point = P + tx1*d;
      if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){
	  normal = vec3(1.0f, 0.0f, 0.0f);
	  setIntersectionDetails(tx1, normal, nearest, index);
	  
	  }

      point = P + tx2*d;
      if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

	  normal = vec3(-1.0f, 0.0f, 0.0f);
	  setIntersectionDetails(tx2, normal, nearest, index);

      }


      float ty1 = (0.5 - P.y) / d.y;
      float ty2 = (0.5 + P.y) / (-d.y);

      point = P + ty1*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

	  normal = vec3(0.0f, 1.0f, 0.0f);
	  setIntersectionDetails(ty1, normal, nearest, index);
      }
      point = P + ty2*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

	  normal = vec3(0.0f, -1.0f, 0.0f);
	  setIntersectionDetails(ty2, normal, nearest, index);


      }


      float tz1 = (0.5 - P.z) / d.z;
      float tz2 = (-0.5 - P.z) / d.z;

      point = P + tz1*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

	  normal = vec3(0.0f, 0.0f, 1.0f);
	  setIntersectionDetails(tz1, normal, nearest, index);

      }
      point = P + tz2*d;
      if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

	  normal = vec3(0.0f, 0.0f, -1.0f);
	  setIntersectionDetails(tz2, normal, nearest, index);
      }

    

  }
  void intersectCone(vec3 P, vec3 d, inout intersectionDetails  nearest, int index){
    


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
	setIntersectionDetails(t1, normal, nearest, index);

      }
      point = P+ t2*d;

      if(P.y + t2*d.y <= 0.5 && P.y + t2*d.y >= -0.5){

	  normal = normalize(vec3(2.f*point.x, 0.25f*(1.f - 2.f*point.y), 2.f*point.z));
	  setIntersectionDetails(t2, normal, nearest, index);

      }
    

      //Cap

      float t3 = (-0.5 - P.y) / d.y;
      vec3 pointCap = P+ t3*d;

      //Check that it's within radius bounds
      if(pow(pointCap.x, 2) + pow(pointCap.z, 2.) <= pow(0.5,2.)){
	  normal = vec3(0.0f, -1.0f, 0.0f);
	  setIntersectionDetails(t2, normal, nearest, index);
      }
      }

      
  }
  void intersectCylinder(vec3 P, vec3 d, inout intersectionDetails  nearest, int index){
    
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

	  setIntersectionDetails(t1, normal, nearest,  index);
	  }
      float t2 = (-b - sqrt(disc)) / (2*a);
      point = P + t2*d;
      if(point.y >= -0.5 && point.y <= 0.5){
	  normal = normalize(vec3(2.*point.x, 0.0f, 2.*point.z));

	  setIntersectionDetails(t2, normal, nearest,  index);
      }

      //caps:


      float t3 = (0.5 - P.y) / d.y;
      float t4 = (-0.5 - P.y) / d.y;

      vec3 pointCap = P + t3*d;
      if(pow(pointCap.x,2.) + pow(pointCap.z,2.) <= (pow(0.5,2.))){
	  normal = vec3(0.0, 1., 0.0);
	  setIntersectionDetails(t3, normal, nearest,  index);
	  
	  }

      pointCap = P + t4*d;
      if(pow(pointCap.x,2.) + pow(pointCap.z,2.) <= (pow(0.5,2.))){
	  normal = vec3(0.0,-1. , 0.0);
	  setIntersectionDetails(t3, normal, nearest,  index);
	  
	  }
	  }
  }
  void intersectSphere(vec3 P, vec3 d, inout intersectionDetails  nearest,  int index){

      float a = pow(d.x,2.) + pow(d.y,2.) + pow(d.z,2.);
      float b = (2*P.x*d.x + 2*P.y*d.y + 2*P.z*d.z);
      float c = pow(P.x,2.) + pow(P.y,2.) + pow(P.z,2.) - pow(0.5, 2.);

      float disc = pow(b,2.) - (4*a*c);
      if(disc >= 0){
      

      
      float t1 = (-b + sqrt(disc)) / (2*a);
      float t2 = (-b - sqrt(disc)) / (2*a);
      vec3 point = P + t1*d;
      vec3 normal = normalize(2.f*(vec4(point,0.f))).xyz;

      
      setIntersectionDetails(t1, normal, nearest,  index);
      
      point = P + t2*d;
      normal = normalize(2.f*(vec4(point,0.f))).xyz;
      
      setIntersectionDetails(t2, normal, nearest,  index);
      }
  }


void intersect(int type, vec3 p_object, vec3 d_object, inout intersectionDetails  nearest, int index){


      if(type == 0){
	  intersectCube(p_object, d_object, nearest, index);

      }
      else if(type ==1){
	  intersectCone(p_object, d_object, nearest, index);

      }
      else if(type == 2){
	  intersectCylinder(p_object, d_object, nearest, index);

      }
      else if(type == 3){
	  intersectSphere(p_object, d_object, nearest, index);

      }
  }

  
bool lightBlocked(vec4 intersectionPoint, vec3 surfaceToLight, float distToLight)
{
  //Intersect with the object
  intersectionDetails nearest;
  nearest.t = -1;
  

  //Check intersection with all object
  for(int i=0; i<scene.n_objects; ++i){   
        
      mat4 transInverse = inverse(scene.objects[i].transformation);
      //Take p_world and d_world to object space
      vec4 intersectPointObject = transInverse*(intersectionPoint + 0.001*vec4(surfaceToLight, 0.f));
      vec3 surfaceToLightObject = mat3(transInverse)*surfaceToLight;
      //Compute itnersection
      intersect(scene.objects[i].type, intersectPointObject.xyz, surfaceToLightObject, nearest, i);
  }
  
  if(nearest.t > 0. && !isinf(distToLight)){
    //Compute distance from intersection point to new intersection point
    float distToObject = length(nearest.t*surfaceToLight);
    if(distToObject > distToLight){
      return false;
    }
  }
  
  return (nearest.t > 0);
}
  
  
vec3 textureColor(intersectionDetails nearest, vec4 intersectPointWorld){

   float u, v, theta, phi;
   vec3 intersectPointObject = (inverse(scene.objects[nearest.primitiveIndex].transformation) * intersectPointWorld).xyz;
   
  if(scene.objects[nearest.primitiveIndex].type == 0){
      
       if(abs(nearest.normalObject.x - 1.) < 0.00001){
	    u = 0.5f - intersectPointObject.z;
            v = 0.5f - intersectPointObject.y;
       }else if(abs(nearest.normalObject.x + 1.)< 0.00001){
            u = 0.5f + intersectPointObject.z;
            v = 0.5f - intersectPointObject.y;
       }else if(abs(nearest.normalObject.y - 1.) < 0.00001){
            u = 0.5f + intersectPointObject.x;
            v = 0.5f + intersectPointObject.z;
       }else if(abs(nearest.normalObject.y + 1.) < 0.00001){
            u = 0.5f + intersectPointObject.x;
            v = 0.5f - intersectPointObject.z;
       }else if(abs(nearest.normalObject.z - 1.) < 0.00001){
            u = 0.5f + intersectPointObject.x;
            v = 0.5f - intersectPointObject.y;
       }else if(abs(nearest.normalObject.z + 1.) < 0.00001){
            u = 0.5f - intersectPointObject.x;
            v = 0.5f - intersectPointObject.y;
       }   
  
  }else if(scene.objects[nearest.primitiveIndex].type == 1){
  
       if(abs(nearest.normalObject.y + 1.) < 0.00001){
            //bottom face
	    u = 0.5f + intersectPointObject.x;
            v = 0.5f - intersectPointObject.z;
       }else{      
            
            //v unit square co-ordinate (origin is at the top left corner)
            v = 1.0f - intersectPointObject.y + 0.5f;
            //u unit square co-ordinate
            theta = atan(intersectPointObject.z, intersectPointObject.x);
            if(theta < 0.0f){
                u = -1*theta/(2.0f*PI);
            }else{
                u = 1 - theta/(2.0f*PI);
            }
       }
       
  }else if(scene.objects[nearest.primitiveIndex].type == 2){

       //Cylinder
       if(abs(nearest.normalObject.y + 1.) < 0.00001){
            //bottom face
	    u = 0.5f + intersectPointObject.x;
            v = 0.5f - intersectPointObject.z;
       }else if(abs(nearest.normalObject.y - 1.) < 0.00001){
            //bottom face
            u = 0.5f + intersectPointObject.x;
            v = 0.5f + intersectPointObject.z;
       }else{
            
            //v unit square co-ordinate (origin is at the top left corner)
            v = 1.0f - intersectPointObject.y + 0.5f;
            //u unit square co-ordinate
            theta = atan(intersectPointObject.z, intersectPointObject.x);
            if(theta < 0.0f){
                u = -1*theta/(2.0f*PI);
            }else{
                u = 1 - theta/(2.0f*PI);
            }
       }
  }else{
  
	//Sphere
        //Based on where the ray intersects the sphere, set the texture co-ordinates
	if(abs(nearest.normalObject.y - 1.) < 0.00001){
	    //Check if the intersection is at the north pole
	    v = 0.0f; //(origin is at the top left corner)
	    //u cannot be computed in the conventional way as z and x are zero. Set to some default value.
	    u = 0.5f;
	}else if(abs(nearest.normalObject.y + 1.) < 0.00001){
	    //Check if the intersection is at the south pole
	    v = 1.0f; //(origin is at the top left corner)
	    //u cannot be computed in the conventional way as z and x are zero. Set to some default value.
	    u = 0.5f;
	}else{
	    //The point of intersection is not a singularity. Compute the u and v in the conventional way.
	    //v unit square co-ordinate
	    phi = asin(intersectPointObject.y/radius);
	    v = 1.0f - phi/ + 0.5f; //(origin is at the top left corner)
	    //u unit square co-ordinate
	    theta = atan(intersectPointObject.z, intersectPointObject.x);
	    if(theta < 0.0f){
		u = -1*theta/(2.0f*PI);
	    }else{
		u = 1 - theta/(2.0f*PI);
	    }
	}
  }
  
    //Compute s and t texture co-ordinates (actual)
    float j = 1;//textureMap->repeatU;
    float k = 1;//textureMap->repeatV;
    //Get the texture width and height
//    int width = textureWidth;
//    int height = (m_textureMapImages[nearestPrimitiveIndex])->height();
    //Compute actual texture co-ordinates
    int ujw = int(u * j * textureWidth);
    int vkh = int(v * k * textureHeight); 
    int s = ujw % textureWidth;
    int t = vkh % textureHeight;

    return (texture(tex, vec2(s,t))).rgb;
     
  
}


vec3 diffuseAndSpecular(vec4 intersectPoint, vec3 normalWorld, intersectionDetails nearest, vec3 surfaceToEye){

        vec3 color = vec3(0.);
	float distToLight;
	float f_att;
        for(int l=0; l < scene.n_lights; l++){

	    vec3 surfaceToLightFull = scene.lights[l].pos - intersectPoint.xyz;
	    vec3 surfaceToLight = normalize(surfaceToLightFull);

            //attenuation for point lights:
            if(scene.lights[l].type == 0){ //Point light
                distToLight = length(surfaceToLightFull);
                f_att = min(1., 1./(scene.lights[l].function.x + scene.lights[l].function.y*distToLight + scene.lights[l].function.z*pow(distToLight,2.)));
            }else{
		distToLight = 1./0.;	      
            }
            //Check for shadows
            
            if(!lightBlocked(intersectPoint, surfaceToLight, distToLight)){

        
	      vec3 reflectedLight = normalize(2.*normalWorld*(dot(normalWorld, surfaceToLight)) - surfaceToLight);
	      
	      vec3 diffuseColor;
	      float blend = scene.objects[nearest.primitiveIndex].mat.blend;
              if(blend > 0.){
		diffuseColor = ((1-blend)*scene.cDiffuseCoeff*scene.objects[nearest.primitiveIndex].mat.cDiffuse + blend*textureColor(nearest, intersectPoint))*max(0., dot(surfaceToLight, normalWorld));
	      }else{
		diffuseColor = scene.cDiffuseCoeff*scene.objects[nearest.primitiveIndex].mat.cDiffuse*max(0., dot(surfaceToLight, normalWorld));
	      }
	      vec3 specularColor = scene.cSpecularCoeff*scene.objects[nearest.primitiveIndex].mat.cSpecular*
				      pow(max(0., dot(reflectedLight, surfaceToEye)), scene.objects[nearest.primitiveIndex].mat.shininess);
              
	     			 
	      color += clamp(f_att*scene.lights[l].color*(diffuseColor + specularColor), vec3(0.), vec3(1.)) ;
	      }
	      

        }

        return color;

}

  
void main(){

    
    intersectionDetails nearest;


    //Generate the ray in the worls space corresponding to the current screen space pixel   
    vec4 d_world = generateRay();

	if(sceneType == 1)
	  createScene1();


    nearest.t = -1.;
    for(int i=0; i<scene.n_objects; ++i){
      
      mat4 transInverse = inverse(scene.objects[i].transformation);
      //Take p_world and d_world to object space
      vec4 p_object = transInverse*camPos;
      vec4 d_object = transInverse*d_world;

      //Compute the intersection with the object
      intersect(scene.objects[i].type, p_object.xyz, d_object.xyz, nearest, i);
    
    }



    fragColor = vec4(0.);
    //Lighting for the pixel based on the nearest intersection

    if(nearest.t >= 0){
        vec3 normalWorld = normalize(transpose(mat3(inverse(scene.objects[nearest.primitiveIndex].transformation))) * nearest.normalObject);
        vec4 intersectPoint = camPos + nearest.t*d_world;
        vec3 surfaceToEye = normalize(camPos.xyz - intersectPoint.xyz);

	int prevPrimitiveIndex = nearest.primitiveIndex;
        float f_att = 1.;
        float distToLight;
        
        vec3 diffuseAndSpecularColor = diffuseAndSpecular(intersectPoint, normalWorld, nearest, surfaceToEye);
	
        
        vec3 reflectColor = vec3(0.);
        intersectionDetails recursiveNearest;        
        for(int i =0; i<numRecursions; ++i){
	      recursiveNearest.t = -1;
	      vec3 reflectedEye = normalize(2.*normalWorld*(dot(normalWorld, surfaceToEye)) - surfaceToEye);

	      for(int j=0; j<scene.n_objects; ++j){
	
		mat4 transInverse = inverse(scene.objects[j].transformation);
		//Take p_world and d_world to object space
		vec4 p_object = transInverse*intersectPoint;
		vec3 d_object = mat3(transInverse)*reflectedEye;

		//Compute the intersection with the object
		intersect(scene.objects[j].type, p_object.xyz, d_object, recursiveNearest, j);
      
	      }
	      

	   if(recursiveNearest.t >= 0){
           //Change new intersection values
           intersectPoint += vec4(recursiveNearest.t*reflectedEye, 1.); 

       
           
	   normalWorld = normalize(transpose(mat3(inverse(scene.objects[recursiveNearest.primitiveIndex].transformation))) * recursiveNearest.normalObject);
	   surfaceToEye = normalize(camPos - intersectPoint).xyz;

	   reflectColor += scene.cSpecularCoeff*scene.objects[prevPrimitiveIndex].mat.cReflection*(diffuseAndSpecular(intersectPoint, normalWorld, recursiveNearest, surfaceToEye) + 
			    scene.cAmbientCoeff*scene.objects[recursiveNearest.primitiveIndex].mat.cAmbient);
  
	  prevPrimitiveIndex = recursiveNearest.primitiveIndex;

        }
           
	  
        }
        



        
        fragColor.rgb += scene.cAmbientCoeff * scene.objects[nearest.primitiveIndex].mat.cAmbient + diffuseAndSpecularColor + reflectColor; 

    }
    fragColor.rgb = clamp(fragColor.rgb, vec3(0.), vec3(1.));
      
}


