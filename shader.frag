#version 330 core


//GPU Raytracer:
//1
//TODO:
//    gl_FragCoord stores window space point.
  //  Need to pass in viewing transformation of camera.  Can start by setting default for these.
//    Also need to pass in size of canvas
//start out with camera at a fixed point


in  vec4 gl_FragCoord;
    
    layout(origin_upper_left) in vec4 gl_FragCoord;




vec4 camPos = vec4(2.,2.,2.,1.);
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
    vec3 c_Diffuse;
    vec3 c_Specular;
    vec3 c_Ambient;
    vec3 c_Reflection;
    vec3 c_Refraction;
    float shininess;

};
struct Primitive
{
    int type; //CUBE = 0, CONE = 1, CYLINDER = 2, SPHERE = 3
    mat4 transformations;

    /*
    vec3 pos;
    //for rotation:
    vec3 rotation;
    float angle;

    vec3 scale;*/
    Material mat;

};
void main(){


    
}


vec3 generateRay(){

    vec4 d(0.f);
    vec4 p_film = vec4((2*gl_FragCoord.x / height)  - 1.f, 1.f - (2*gl_FragCoord.y / width), -1, 0.f);

    vec4 p_world = inverse(view)*p_film;

    d = normalize(p_word - camPos);

    return d; 
}


float intersect(int type, vec4 d){

    if(type == 0){
        return intersectCube(vec4 d);

    }
    else if(type ==1){
        return intersectCone(vec4 d);

    }
    else if(type == 2){
        return intersectCylinder(vec4 d);

    }
    else if(type == 3){
        return intersectSphere(vec4 d);

    }
}
 

float intersectCube(vec4 d){
    float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;

    float tx1 = (0.5 - camPos.x) / d.x;
    float tx2 = (0.5 + camPos.x) / (-d.x);

    vec3 point = camPos + tx1*d;
    if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5))
        setTInfo(intersectInfo, tx1, 0, 1);

    point = camPos + tx2*d;
    if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(intersectInfo, tx2, 0, -1);

    }


    float ty1 = (0.5 - camPos.y) / d.y;
    float ty2 = (0.5 + camPos.y) / (-d.y);

    point = camPos + ty1*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(intersectInfo, ty1, 1, 1);
    }
    point = camPos + ty2*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(intersectInfo, ty2, 1, -1);


    }


    float tz1 = (0.5 - camPos.z) / d.z;
    float tz2 = (-0.5 - camPos.z) / d.z;

    point = camPos + tz1*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

        setTInfo(intersectInfo, tz1, 2, 1);

    }
    point = camPos + tz2*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){



        setTInfo(intersectInfo, tz2, 2, -1);

    }

    if(intersectInfo[1] == 0)
        m_pointNormal = vec4(intersectInfo[2], 0.0f, 0.0f, 0.f);

    else if(intersectInfo[1] == 1)
        m_pointNormal = vec4(0.0f, intersectInfo[2], 0.0f,0.f);
    else if(intersectInfo[1] == 2)
        m_pointNormal = vec4(0.0f, 0.0f, intersectInfo[2],0.f);

    m_objNormal = m_pointNormal;

    float t = intersectInfo[0];
    delete[] intersectInfo;
    return t;

}
float intersectCone(vec3 d){
 //intersectInfo[0] = t, intersectInfo[1] = cap or body
    float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;


    //Body:

    float a = pow(d.x,2) + pow(d.z, 2) - (0.25 * pow(d.y, 2));
    float b = 2*camPos.x*d.x + 2*camPos.z*d.z - (0.5*camPos.y*d.y) + (0.25*d.y);
    float c = pow(camPos.x,2) + pow(camPos.z, 2) - (0.25 * pow(camPos.y, 2)) + (0.25*camPos.y) - (1./16.);

    float disc = pow(b,2) - (4*a*c);
    if(disc < 0){
        return -1;
    }

    float t1 = (-b + sqrt(disc)) / (2*a);
    float t2;
    if(disc ==0)
        t2 = t1;
    else
         t2 = (-b - sqrt(disc)) / (2*a);

    vec3 point = camPos.+ t1*d;
    //Check that it's within y bounds
    if(camPos.y + t1*d.y <= 0.5 && camPos.y + t1*d.y >= -0.5){

        setTInfo(intersectInfo, t1, 0, 0);


    }
    if(camPos.y + t2*d.y <= 0.5 && camPos.y + t2*d.y >= -0.5){

        setTInfo(intersectInfo, t2, 0, 0);
    }
    if(EQ(intersectInfo[0], t2))
        point = camPos.+ t2*d;

    //Cap

    float t3 = (-0.5 - camPos.y) / d.y;
    vec3 pointC = camPos.+ t3*d;

    //Check that it's within radius bounds
    if(pow(pointC.x, 2) + pow(pointC.z, 2) <= pow(0.5,2))
        setTInfo(intersectInfo, t3, 1, 1);


    if(intersectInfo[1] == 0)
        m_pointNormal = normalize(vec4(2.f*point.x, 0.25f*(1.f - 2.f*point.y), 2.f*point.z, 0.f));
    else if(intersectInfo[1] == 1)
        m_pointNormal = vec4(0.0f, -1.0f, 0.0f,0.f);

    m_objNormal = m_pointNormal;

    float t = intersectInfo[0];
    delete[] intersectInfo;
    return t;
}
float intersectCylinder(vec3 d){
 //intersectInfo[0] = t, intersectInfo[1] = cap or body, intersectInfo[2] bottom or top
    float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;

    //f(x,y,z) = x^2 + z^2 - 0.5^2 = 0
    //f(P+td) = pow(P.x + t*d.x,2) + pow(P.z + t*d.z,2) - 0.5^2
    //        = pow(P.x,2) + 2*P.x*t*d.x + pow(t*d.x,2) + pow(P.z,2) + 2*P.z*t*d.z + pow(t*d.z,2) - 0.5^2
    //        = t^2(d.x^2 + d.z^2) + t(2*P.x*d.x + 2*P.z*d.z) + (P.x^2 + P.z^2 - 0.5^2)

    float a = pow(d.x,2) + pow(d.z, 2);
    float b = 2*P.x*d.x + 2*P.z*d.z;
    float c = pow(P.x,2) + pow(P.z, 2) - pow(0.5,2);

    float disc = pow(b,2) - (4*a*c);
    if(disc < 0)
        return -1;

    float t1 = (-b + sqrt(disc)) / (2*a);
    vec3 point = P + t1*d;
    if(point.y >= -0.5 && point.y <= 0.5)
        setTInfo(intersectInfo, t1, 0, 0);
    float t2 = (-b - sqrt(disc)) / (2*a);
    vec3 point2 = P + t2*d;
    if(point2.y >= -0.5 && point2.y <= 0.5)
        setTInfo(intersectInfo, t2, 0, 0);

    if(EQ(intersectInfo[0], t2))
        point = point2;
    //caps:


    float t3 = (0.5 - P.y) / d.y;
    float t4 = (-0.5 - P.y) / d.y;

    vec3 pointC = P + t3*d;
    if(pow(pointC.x,2) + pow(pointC.z,2) <= (pow(0.5,2)))
        setTInfo(intersectInfo, t3, 1, 1);

    pointC = P + t4*d;
    if(pow(pointC.x,2) + pow(pointC.z,2) <= (pow(0.5,2)))
        setTInfo(intersectInfo, t4, 1, -1);




    if(EQ(intersectInfo[1], 0))
        m_pointNormal = normalize(vec4(2.f*point.x, 0.0f, 2.f*point.z,0.f));
    else if(EQ(intersectInfo[1], 1))
        m_pointNormal = vec4(0.0f, intersectInfo[2], 0.0f,0.f);

    m_objNormal = m_pointNormal;


    float t = intersectInfo[0];
    delete[] intersectInfo;
    intersectInfo = NULL;
    return t;




}
float intersectSphere(vec3 d){
float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;

    std::vector<float> ts;
    float a = pow(d.x,2) + pow(d.y,2) + pow(d.z,2);
    float b = (2*P.x*d.x + 2*P.y*d.y + 2*P.z*d.z);
    float c = pow(P.x,2) + pow(P.y,2) + pow(P.z,2) - pow(0.5, 2);

    float disc = pow(b,2) - (4*a*c);
    if(disc < 0){
        return -1;
    }
    float t1 = (-b + sqrt(disc)) / (2*a);
    float t2 = (-b - sqrt(disc)) / (2*a);
    vec3 point = P + t1*d;
    setTInfo(intersectInfo, t1, 0, 0);
    setTInfo(intersectInfo, t2, 0, 0);
    if(EQ(t2, intersectInfo[0]))
        point = P + t2*d;

    m_pointNormal = normalize(2.f*(vec4(point,0.f)));

    m_objNormal = m_pointNormal;


    float t = intersectInfo[0];
    delete[] intersectInfo;
    return t;


}

void setTInfo(float *tInfo, float newT, int axis, int side){


    if(newT >= 0){
        if(newT < tInfo[0] || tInfo[0] < 0){

            tInfo[1] = axis;
            tInfo[0] = newT;
            tInfo[2] = side;
        }

    }

}


    int type; //CUBE = 0, CONE = 1, CYLINDER = 2, SPHERE = 3
    mat4 transformations;

    /*
    vec3 pos;
    //for rotation:
    vec3 rotation;
    float angle;

    vec3 scale;*/
    Material mat;

}
void main(){


    
}


vec3 generateRay(){

    vec4 d(0.f);
    vec4 p_film = vec4((2*gl_FragCoord.x / height)  - 1.f, 1.f - (2*gl_FragCoord.y / width), -1, 0.f);

    vec4 p_world = inverse(view)*p_film;

    d = normalize(p_word - camPos);

    return d; 
}


float intersect(int type, vec4 d){

    if(type == 0){
        return intersectCube(vec4 d);

    }
    else if(type ==1){
        return intersectCone(vec4 d);

    }
    else if(type == 2){
        return intersectCylinder(vec4 d);

    }
    else if(type == 3){
        return intersectSphere(vec4 d);

    }
}
 

float intersectCube(vec4 d){
    float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;

    float tx1 = (0.5 - camPos.x) / d.x;
    float tx2 = (0.5 + camPos.x) / (-d.x);

    vec3 point = camPos + tx1*d;
    if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5))
        setTInfo(intersectInfo, tx1, 0, 1);

    point = camPos + tx2*d;
    if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(intersectInfo, tx2, 0, -1);

    }


    float ty1 = (0.5 - camPos.y) / d.y;
    float ty2 = (0.5 + camPos.y) / (-d.y);

    point = camPos + ty1*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(intersectInfo, ty1, 1, 1);
    }
    point = camPos + ty2*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(intersectInfo, ty2, 1, -1);


    }


    float tz1 = (0.5 - camPos.z) / d.z;
    float tz2 = (-0.5 - camPos.z) / d.z;

    point = camPos + tz1*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

        setTInfo(intersectInfo, tz1, 2, 1);

    }
    point = camPos + tz2*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){



        setTInfo(intersectInfo, tz2, 2, -1);

    }

    if(intersectInfo[1] == 0)
        m_pointNormal = vec4(intersectInfo[2], 0.0f, 0.0f, 0.f);

    else if(intersectInfo[1] == 1)
        m_pointNormal = vec4(0.0f, intersectInfo[2], 0.0f,0.f);
    else if(intersectInfo[1] == 2)
        m_pointNormal = vec4(0.0f, 0.0f, intersectInfo[2],0.f);

    m_objNormal = m_pointNormal;

    float t = intersectInfo[0];
    delete[] intersectInfo;
    return t;

}
float intersectCone(vec3 d){
 //intersectInfo[0] = t, intersectInfo[1] = cap or body
    float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;


    //Body:

    float a = pow(d.x,2) + pow(d.z, 2) - (0.25 * pow(d.y, 2));
    float b = 2*camPos.x*d.x + 2*camPos.z*d.z - (0.5*camPos.y*d.y) + (0.25*d.y);
    float c = pow(camPos.x,2) + pow(camPos.z, 2) - (0.25 * pow(camPos.y, 2)) + (0.25*camPos.y) - (1./16.);

    float disc = pow(b,2) - (4*a*c);
    if(disc < 0){
        return -1;
    }

    float t1 = (-b + sqrt(disc)) / (2*a);
    float t2;
    if(disc ==0)
        t2 = t1;
    else
         t2 = (-b - sqrt(disc)) / (2*a);

    vec3 point = camPos.+ t1*d;
    //Check that it's within y bounds
    if(camPos.y + t1*d.y <= 0.5 && camPos.y + t1*d.y >= -0.5){

        setTInfo(intersectInfo, t1, 0, 0);


    }
    if(camPos.y + t2*d.y <= 0.5 && camPos.y + t2*d.y >= -0.5){

        setTInfo(intersectInfo, t2, 0, 0);
    }
    if(EQ(intersectInfo[0], t2))
        point = camPos.+ t2*d;

    //Cap

    float t3 = (-0.5 - camPos.y) / d.y;
    vec3 pointC = camPos.+ t3*d;

    //Check that it's within radius bounds
    if(pow(pointC.x, 2) + pow(pointC.z, 2) <= pow(0.5,2))
        setTInfo(intersectInfo, t3, 1, 1);


    if(intersectInfo[1] == 0)
        m_pointNormal = normalize(vec4(2.f*point.x, 0.25f*(1.f - 2.f*point.y), 2.f*point.z, 0.f));
    else if(intersectInfo[1] == 1)
        m_pointNormal = vec4(0.0f, -1.0f, 0.0f,0.f);

    m_objNormal = m_pointNormal;

    float t = intersectInfo[0];
    delete[] intersectInfo;
    return t;
}
float intersectCylinder(vec3 d){
 //intersectInfo[0] = t, intersectInfo[1] = cap or body, intersectInfo[2] bottom or top
    float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;

    //f(x,y,z) = x^2 + z^2 - 0.5^2 = 0
    //f(P+td) = pow(P.x + t*d.x,2) + pow(P.z + t*d.z,2) - 0.5^2
    //        = pow(P.x,2) + 2*P.x*t*d.x + pow(t*d.x,2) + pow(P.z,2) + 2*P.z*t*d.z + pow(t*d.z,2) - 0.5^2
    //        = t^2(d.x^2 + d.z^2) + t(2*P.x*d.x + 2*P.z*d.z) + (P.x^2 + P.z^2 - 0.5^2)

    float a = pow(d.x,2) + pow(d.z, 2);
    float b = 2*P.x*d.x + 2*P.z*d.z;
    float c = pow(P.x,2) + pow(P.z, 2) - pow(0.5,2);

    float disc = pow(b,2) - (4*a*c);
    if(disc < 0)
        return -1;

    float t1 = (-b + sqrt(disc)) / (2*a);
    vec3 point = P + t1*d;
    if(point.y >= -0.5 && point.y <= 0.5)
        setTInfo(intersectInfo, t1, 0, 0);
    float t2 = (-b - sqrt(disc)) / (2*a);
    vec3 point2 = P + t2*d;
    if(point2.y >= -0.5 && point2.y <= 0.5)
        setTInfo(intersectInfo, t2, 0, 0);

    if(EQ(intersectInfo[0], t2))
        point = point2;
    //caps:


    float t3 = (0.5 - P.y) / d.y;
    float t4 = (-0.5 - P.y) / d.y;

    vec3 pointC = P + t3*d;
    if(pow(pointC.x,2) + pow(pointC.z,2) <= (pow(0.5,2)))
        setTInfo(intersectInfo, t3, 1, 1);

    pointC = P + t4*d;
    if(pow(pointC.x,2) + pow(pointC.z,2) <= (pow(0.5,2)))
        setTInfo(intersectInfo, t4, 1, -1);




    if(EQ(intersectInfo[1], 0))
        m_pointNormal = normalize(vec4(2.f*point.x, 0.0f, 2.f*point.z,0.f));
    else if(EQ(intersectInfo[1], 1))
        m_pointNormal = vec4(0.0f, intersectInfo[2], 0.0f,0.f);

    m_objNormal = m_pointNormal;


    float t = intersectInfo[0];
    delete[] intersectInfo;
    intersectInfo = NULL;
    return t;




}
float intersectSphere(vec3 d){
float *intersectInfo;
    intersectInfo[0] = -1;
    intersectInfo[1] = -1;
    intersectInfo[2] = 0;

    std::vector<float> ts;
    float a = pow(d.x,2) + pow(d.y,2) + pow(d.z,2);
    float b = (2*P.x*d.x + 2*P.y*d.y + 2*P.z*d.z);
    float c = pow(P.x,2) + pow(P.y,2) + pow(P.z,2) - pow(0.5, 2);

    float disc = pow(b,2) - (4*a*c);
    if(disc < 0){
        return -1;
    }
    float t1 = (-b + sqrt(disc)) / (2*a);
    float t2 = (-b - sqrt(disc)) / (2*a);
    vec3 point = P + t1*d;
    setTInfo(intersectInfo, t1, 0, 0);
    setTInfo(intersectInfo, t2, 0, 0);
    if(EQ(t2, intersectInfo[0]))
        point = P + t2*d;

    m_pointNormal = normalize(2.f*(vec4(point,0.f)));

    m_objNormal = m_pointNormal;


    float t = intersectInfo[0];
    delete[] intersectInfo;
    return t;


}

void setTInfo(float *tInfo, float newT, int axis, int side){


    if(newT >= 0){
        if(newT < tInfo[0] || tInfo[0] < 0){

            tInfo[1] = axis;
            tInfo[0] = newT;
            tInfo[2] = side;
        }

    }

}

