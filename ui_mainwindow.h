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
#include <QtWidgets/QDockWidget>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QRadioButton>
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
    QVBoxLayout *verticalLayout_2;
    QRadioButton *sceneTypeSimple;
    QRadioButton *sceneTypeCornell;
    QRadioButton *sceneTypeSpecial1;

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
        verticalLayout_2 = new QVBoxLayout(Scenes);
        verticalLayout_2->setSpacing(6);
        verticalLayout_2->setContentsMargins(11, 11, 11, 11);
        verticalLayout_2->setObjectName(QStringLiteral("verticalLayout_2"));
        sceneTypeSimple = new QRadioButton(Scenes);
        sceneTypeSimple->setObjectName(QStringLiteral("sceneTypeSimple"));

        verticalLayout_2->addWidget(sceneTypeSimple);

        sceneTypeCornell = new QRadioButton(Scenes);
        sceneTypeCornell->setObjectName(QStringLiteral("sceneTypeCornell"));

        verticalLayout_2->addWidget(sceneTypeCornell);

        sceneTypeSpecial1 = new QRadioButton(Scenes);
        sceneTypeSpecial1->setObjectName(QStringLiteral("sceneTypeSpecial1"));

        verticalLayout_2->addWidget(sceneTypeSpecial1);


        verticalLayout->addWidget(Scenes);

        sideBar->setWidget(dockWidgetContents);
        MainWindow->addDockWidget(static_cast<Qt::DockWidgetArea>(1), sideBar);

        retranslateUi(MainWindow);
        QObject::connect(sceneTypeCornell, SIGNAL(clicked()), view, SLOT(setScene1()));
        QObject::connect(sceneTypeSimple, SIGNAL(clicked()), view, SLOT(setScene2()));
        QObject::connect(sceneTypeSpecial1, SIGNAL(clicked()), view, SLOT(setScene3()));

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "A CS123 Final", 0));
        Scenes->setTitle(QApplication::translate("MainWindow", "Scenes", 0));
        sceneTypeSimple->setText(QApplication::translate("MainWindow", "Scene 1", 0));
        sceneTypeCornell->setText(QApplication::translate("MainWindow", "Scene 2", 0));
        sceneTypeSpecial1->setText(QApplication::translate("MainWindow", "Scene 3", 0));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
