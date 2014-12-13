#include "Databinding.h"

#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "Settings.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    //connect(ui->view, SIGNAL(depthOfFieldChanged(int)), ui->depthOfViewSlider, SLOT(setValue(int)));
    connect(ui->view, SIGNAL(scene1Set()), ui->sceneTypeCornell, SLOT(click()));

    //connect(ui->view, SIGNAL(depthOfFieldToggled(bool)), ui->depthOfViewSlider, SLOT(setEnabled(bool)));



/*#define BIND(b) { \
    DataBinding *_b = (b); \
    m_bindings.push_back(_b); \
    assert(connect(_b, SIGNAL(dataChanged()), this, SLOT(settingsChanged()))); \
}
    QButtonGroup *sceneButtonGroup = new QButtonGroup;
    m_buttonGroups.push_back(sceneButtonGroup);

    BIND( ChoiceBinding::bindRadioButtons(
            sceneButtonGroup,
            NUM_SCENE_TYPES,
            settings.sceneType,
            ui->sceneTypeSimple,
            ui->sceneTypeCornell,
            ui->sceneTypeSpecial1))


    BIND(IntBinding::bindSliderAndTextbox(
        ui->depthOfViewSlider, ui->depthOfViewBox, settings.depthOfViewFocus, 0, 96))
    BIND( BoolBinding::bindCheckbox(ui->depthOfView, settings.depthOfView) )*/

}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::settingsChanged()
{
    ui->view->settingsChanged();
}
