/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.2.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QLocale>
#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QDockWidget>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QRadioButton>
#include <QtWidgets/QSlider>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>
#include "view.h"

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QWidget *centralWidget;
    QHBoxLayout *horizontalLayout;
    View *view;
    QDockWidget *sideBar;
    QWidget *dockWidgetContents;
    QVBoxLayout *verticalLayout;
    QGroupBox *Scenes;
    QRadioButton *sceneTypeSimple;
    QRadioButton *sceneTypeCornell;
    QRadioButton *sceneTypeSpecial1;
    QGroupBox *Effects;
    QSlider *depthOfViewSlider;
    QLineEdit *depthOfViewBox;
    QCheckBox *depthOfView;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QStringLiteral("MainWindow"));
        MainWindow->resize(800, 600);
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        horizontalLayout = new QHBoxLayout(centralWidget);
        horizontalLayout->setSpacing(6);
        horizontalLayout->setContentsMargins(11, 11, 11, 11);
        horizontalLayout->setObjectName(QStringLiteral("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        view = new View(centralWidget);
        view->setObjectName(QStringLiteral("view"));

        horizontalLayout->addWidget(view);

        MainWindow->setCentralWidget(centralWidget);
        sideBar = new QDockWidget(MainWindow);
        sideBar->setObjectName(QStringLiteral("sideBar"));
        QSizePolicy sizePolicy(QSizePolicy::Expanding, QSizePolicy::Preferred);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(sideBar->sizePolicy().hasHeightForWidth());
        sideBar->setSizePolicy(sizePolicy);
        sideBar->setLocale(QLocale(QLocale::English, QLocale::UnitedStates));
        sideBar->setFeatures(QDockWidget::NoDockWidgetFeatures);
        dockWidgetContents = new QWidget();
        dockWidgetContents->setObjectName(QStringLiteral("dockWidgetContents"));
        verticalLayout = new QVBoxLayout(dockWidgetContents);
        verticalLayout->setSpacing(6);
        verticalLayout->setContentsMargins(11, 11, 11, 11);
        verticalLayout->setObjectName(QStringLiteral("verticalLayout"));
        Scenes = new QGroupBox(dockWidgetContents);
        Scenes->setObjectName(QStringLiteral("Scenes"));
        sceneTypeSimple = new QRadioButton(Scenes);
        sceneTypeSimple->setObjectName(QStringLiteral("sceneTypeSimple"));
        sceneTypeSimple->setGeometry(QRect(20, 30, 102, 20));
        sceneTypeCornell = new QRadioButton(Scenes);
        sceneTypeCornell->setObjectName(QStringLiteral("sceneTypeCornell"));
        sceneTypeCornell->setGeometry(QRect(20, 50, 102, 20));
        sceneTypeSpecial1 = new QRadioButton(Scenes);
        sceneTypeSpecial1->setObjectName(QStringLiteral("sceneTypeSpecial1"));
        sceneTypeSpecial1->setGeometry(QRect(20, 80, 102, 20));

        verticalLayout->addWidget(Scenes);

        Effects = new QGroupBox(dockWidgetContents);
        Effects->setObjectName(QStringLiteral("Effects"));
        depthOfViewSlider = new QSlider(Effects);
        depthOfViewSlider->setObjectName(QStringLiteral("depthOfViewSlider"));
        depthOfViewSlider->setGeometry(QRect(40, 60, 111, 20));
        depthOfViewSlider->setOrientation(Qt::Horizontal);
        depthOfViewBox = new QLineEdit(Effects);
        depthOfViewBox->setObjectName(QStringLiteral("depthOfViewBox"));
        depthOfViewBox->setGeometry(QRect(150, 60, 41, 21));
        depthOfView = new QCheckBox(Effects);
        depthOfView->setObjectName(QStringLiteral("depthOfView"));
        depthOfView->setGeometry(QRect(10, 40, 131, 20));

        verticalLayout->addWidget(Effects);

        sideBar->setWidget(dockWidgetContents);
        MainWindow->addDockWidget(static_cast<Qt::DockWidgetArea>(1), sideBar);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "A CS123 Final", 0));
        Scenes->setTitle(QApplication::translate("MainWindow", "Scenes", 0));
        sceneTypeSimple->setText(QApplication::translate("MainWindow", "Scene 1", 0));
        sceneTypeCornell->setText(QApplication::translate("MainWindow", "Scene 2", 0));
        sceneTypeSpecial1->setText(QApplication::translate("MainWindow", "Scene 3", 0));
        Effects->setTitle(QApplication::translate("MainWindow", "Effects", 0));
        depthOfView->setText(QApplication::translate("MainWindow", "Depth of View", 0));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
