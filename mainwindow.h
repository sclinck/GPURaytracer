#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QButtonGroup>

namespace Ui {
    class MainWindow;
}
class DataBinding;

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();


private:
    Ui::MainWindow *ui;
    QList<DataBinding*> m_bindings;
    QList<QButtonGroup*> m_buttonGroups;


public slots:
    // Used internally to keep data bindings and the user interface in sync.
    void settingsChanged();
};

#endif // MAINWINDOW_H

