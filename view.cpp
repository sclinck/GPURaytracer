#include "lib/ResourceLoader.h"

#include "view.h"
#include "lib/CS123Common.h"
#include <QApplication>
#include <QKeyEvent>
#include <iostream>

View::View(QWidget *parent) : QGLWidget(parent)
{
    // View needs all mouse move events, not just mouse drag events
    setMouseTracking(true);

    // Hide the cursor since this is a fullscreen app
    setCursor(Qt::BlankCursor);

    // View needs keyboard focus
    setFocusPolicy(Qt::StrongFocus);

    // The game loop is implemented using a timer
    connect(&timer, SIGNAL(timeout()), this, SLOT(tick()));
    m_scene = 1;
    m_depth = 0;
    m_width = 500;
    m_height = 500;
}

View::~View()
{
}

void View::initializeGL()
{
    // All OpenGL initialization *MUST* be done during or after this
    // method. Before this method is called, there is no active OpenGL
    // context and all OpenGL calls have no effect.
    fprintf( stdout, "Using OpenGL Version %s\n", glGetString( GL_VERSION ) );

    //initialize glew
    GLenum err = glewInit();
    if ( GLEW_OK != err )
    {
        /* Problem: glewInit failed, something is seriously wrong. */
        fprintf( stderr, "Error: %s\n", glewGetErrorString( err ) );
    }
    fprintf( stdout, "Status: Using GLEW %s\n", glewGetString( GLEW_VERSION ) );

    fflush(stdout);
    m_shader = ResourceLoader::loadShaders( "shaders/shader.vert", "shaders/shader.frag" );



    // Start a timer that will try to get 60 frames per second (the actual
    // frame rate depends on the operating system and other running programs)
    time.start();
    timer.start(1000 / 60);

    // Center the mouse, which is explained more in mouseMoveEvent() below.
    // This needs to be done here because the mouse may be initially outside
    // the fullscreen window and will not automatically receive mouse move
    // events. This occurs if there are two monitors and the mouse is on the
    // secondary monitor.
    //QCursor::setPos(mapToGlobal(QPoint(width() / 2, height() / 2)));
}

void View::paintGL()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);


    GLuint vaoID;

    GLfloat vertexBufferData[] = {0.,1.,0,
                                  0.,0.,0,
                                  1.,0,0,
                                  1,0,0,
                                  1,1,0,
                                  0,1,0};

    // VAO init
    glGenVertexArrays(1, &vaoID);
    glBindVertexArray(vaoID);

    // Vertex buffer init
    GLuint vertexBuffer;
    glGenBuffers(1, &vertexBuffer);
    glBindBuffer(GL_ARRAY_BUFFER, vertexBuffer);

    // Give our vertices to OpenGL.
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertexBufferData), vertexBufferData, GL_STATIC_DRAW);

    // Expose vertices to shader
    glEnableVertexAttribArray( glGetAttribLocation( m_shader, "position" ));
    glVertexAttribPointer(
       glGetAttribLocation( m_shader, "position" ),
       3,                  // num vertices per element (3 for triangle)
       GL_FLOAT,           // type
       GL_FALSE,           // normalized?
       0,                  // stride
       (void*)0            // array buffer offset
    );

    glBindBuffer(GL_ARRAY_BUFFER,0);
    glBindVertexArray(0);


    // TODO: Implement the demo rendering here

    glUseProgram(m_shader);

    glm::mat4 quad = glm::scale(glm::vec3(m_width, m_height, 500.f));
    glm::vec2 size = glm::vec2(m_width, m_height);
    glUniformMatrix4fv(glGetUniformLocation(m_shader, "mvp"), 1, GL_FALSE, &quad[0][0]);
    glUniform1i(glGetUniformLocation(m_shader, "textureWidth"), 0);
    glUniform1i(glGetUniformLocation(m_shader, "textureHeight"), 0);
    glUniform2fv(glGetUniformLocation(m_shader, "size"), 1, &size[0]);


    glUniform1i(glGetUniformLocation(m_shader, "sceneType"), m_scene);

    glBindVertexArray(vaoID);
    glDrawArrays(GL_TRIANGLES, 0, 6);
    glBindVertexArray(0);



    glUseProgram(0);


}

void View::resizeGL(int w, int h)
{
    m_width = w;
    m_height = h;
    glViewport(0, 0, w, h);
}

void View::mousePressEvent(QMouseEvent *event)
{
}

void View::mouseMoveEvent(QMouseEvent *event)
{
    // This starter code implements mouse capture, which gives the change in
    // mouse position since the last mouse movement. The mouse needs to be
    // recentered after every movement because it might otherwise run into
    // the edge of the screen, which would stop the user from moving further
    // in that direction. Note that it is important to check that deltaX and
    // deltaY are not zero before recentering the mouse, otherwise there will
    // be an infinite loop of mouse move events.
    int deltaX = event->x() - width() / 2;
    int deltaY = event->y() - height() / 2;
    if (!deltaX && !deltaY) return;
    QCursor::setPos(mapToGlobal(QPoint(width() / 2, height() / 2)));

    // TODO: Handle mouse movements here
}

void View::mouseReleaseEvent(QMouseEvent *event)
{
}

void View::keyPressEvent(QKeyEvent *event)
{
    if (event->key() == Qt::Key_Escape) QApplication::quit();

    // TODO: Handle keyboard presses here
}

void View::keyReleaseEvent(QKeyEvent *event)
{
}

void View::tick()
{
    // Get the number of seconds since the last tick (variable update rate)
    float seconds = time.restart() * 0.001f;

    // TODO: Implement the demo update here

    // Flag this view for repainting (Qt will call paintGL() soon after)
    update();
}

void View::settingsChanged() {

    // TODO: Process changes to the application settings.

}

//void View::setDepthOfField(int depth){
//    m_depth = depth;
//    emit depthOfFieldChanged(depth);
//    update();


//}
void View::setScene1(){
    if(m_scene != 1){
        m_scene = 1;
        update();
        emit setScene1();
    }
}
void View::setScene2(){
    if(m_scene != 2){
        m_scene = 2;
        update();
    }

}
void View::setScene3(){
    if(m_scene != 3){
        m_scene = 3;
     update();
    }
    std::cout < "3";
    std::cout.flush();

}
