/*GPU Raytracer:

TODO:
    gl_FragCoord stores window space point.
    Need to pass in viewing transformation of camera.  Can start by setting default for these.
    Also need to pass in size of canvas
start out with camera at a fixed point



*/

layout(origin_upper_left) in vec4 gl_FragCoord;

vec4 camPos = vec4(2.,2.,2.,1.);
float far = 30.;
float aspectRatio = 1.;

vec4 look = -camPos;
look.w = 0.;
vec4 up = vec4(0.,1.,0.,0.);


float tan_h = glm::tan(m_height/2.);
float height = 2*m_far *tan_h;
float tan_w = (m_aspectRatio*height) / (2. * m_far);


mat4 camScale = transpose(mat4(1./(far*tan_w), 0 ,             0,        0,
                          0,                   1./(far*tan_h), 0,        0,
                          0,                   0,              1./far,   0,
                          0,                   0,              0,        1));

mat4 camTranslate = glm::transpose(mat4(1,0,0,-camPos.x,
                                        0,1,0,-camPos.y,
                                        0,0,1,-camPos.z,
                                        0,0,0,1));
vec3 w = -normalize(vec3(look.x,look.y,look.z));
vec3 v = normalize(vec3(m_up.x,up.y,up.z) - (dot(vec3(up.x,up.y,up.z), w)*w));
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

}
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
    float *min = new float[3];
    min[0] = -1;
    min[1] = -1;
    min[2] = 0;

    float tx1 = (0.5 - camPos.x) / d.x;
    float tx2 = (0.5 + camPos.x) / (-d.x);

    glm::vec3 point = camPos + tx1*d;
    if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5))
        setTInfo(min, tx1, 0, 1);

    point = camPos + tx2*d;
    if((point.y <= 0.5 && point.y >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(min, tx2, 0, -1);

    }


    float ty1 = (0.5 - camPos.y) / d.y;
    float ty2 = (0.5 + camPos.y) / (-d.y);

    point = camPos + ty1*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(min, ty1, 1, 1);
    }
    point = camPos + ty2*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.z <= 0.5 && point.z >= -0.5)){

        setTInfo(min, ty2, 1, -1);


    }


    float tz1 = (0.5 - camPos.z) / d.z;
    float tz2 = (-0.5 - camPos.z) / d.z;

    point = camPos + tz1*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){

        setTInfo(min, tz1, 2, 1);

    }
    point = camPos + tz2*d;
    if((point.x <= 0.5 && point.x >= -0.5) && (point.y <= 0.5 && point.y >= -0.5)){



        setTInfo(min, tz2, 2, -1);

    }

    if(min[1] == 0)
        m_pointNormal = glm::vec4(min[2], 0.0f, 0.0f, 0.f);

    else if(min[1] == 1)
        m_pointNormal = glm::vec4(0.0f, min[2], 0.0f,0.f);
    else if(min[1] == 2)
        m_pointNormal = glm::vec4(0.0f, 0.0f, min[2],0.f);

    m_objNormal = m_pointNormal;

    float t = min[0];
    delete[] min;
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

