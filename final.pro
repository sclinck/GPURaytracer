QT += core gui opengl

TARGET = final
TEMPLATE = app

# If you add your own folders, add them to INCLUDEPATH and DEPENDPATH, e.g.
INCLUDEPATH += glm lib
DEPENDPATH += glm lib

SOURCES += main.cpp \
    mainwindow.cpp \
    view.cpp \
    lib/ResourceLoader.cpp \
    Databinding.cpp \
    Settings.cpp

HEADERS += mainwindow.h \
    view.h \
    lib/ResourceLoader.h \
    Databinding.h \
    Settings.h \
    lib/CS123Common.h

FORMS += mainwindow.ui
OTHER_FILES += shaders/shader.frag shaders/shader.vert \
    shaders/shader.frag \
    shaders/shader.vert \
    shaders/phong.frag \
    shaders/phong.vert



#LIBS += -L/course/cs123/lib/glew/glew-1.10.0/include -lGLEW
#INCLUDEPATH += /course/cs123/lib/glew/glew-1.10.0/include
#DEPENDPATH += /course/cs123/lib/glew/glew-1.10.0/include


#NEED THESE TO COMPILE ON MAC OS X:
win32:CONFIG(release, debug|release): LIBS += -L/course/cs123/lib/glew/glew-1.10.0/lib/release/ -lGLEW
else:win32:CONFIG(debug, debug|release): LIBS += -L/course/cs123/lib/glew/glew-1.10.0/lib/debug/ -lGLEW
else:unix: LIBS += -L/opt/local/lib/ -lGLEW

#INCLUDEPATH+=/opt/local/include
#DEPENDPATH+=/opt/local/include
