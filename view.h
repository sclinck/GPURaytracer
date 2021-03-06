#ifndef VIEW_H
#define VIEW_H

#include <qgl.h>
#include <QTime>
#include <QTimer>

class View : public QGLWidget
{
    Q_OBJECT

public:
    View(QWidget *parent);
    ~View();
    void settingsChanged();


public slots:
    void setScene1();
    void setScene2();
    void setScene3();

    //void setDepthOfField(int depth);
private:
    QTime time;
    QTimer timer;

    void initializeGL();
    void paintGL();
    void resizeGL(int w, int h);

    void mousePressEvent(QMouseEvent *event);
    void mouseMoveEvent(QMouseEvent *event);
    void mouseReleaseEvent(QMouseEvent *event);

    void keyPressEvent(QKeyEvent *event);
    void keyReleaseEvent(QKeyEvent *event);

    GLuint m_shader;

    int m_scene;
    int m_depth;
    int m_width;
    int m_height;

private slots:
    void tick();
signals:
    void scene1Set();
    //void depthOfFieldChanged(int depth);
    //void depthOfFieldToggled(bool toggle);

};

#endif // VIEW_H

