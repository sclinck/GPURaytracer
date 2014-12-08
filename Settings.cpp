/*!

 Settings.h
 CS123 Support Code

 @author  Evan Wallace (edwallac)
 @date    9/1/2010

 This file contains various settings and enumerations that you will need to
 use in the various assignments. The settings are bound to the GUI via static
 data bindings.

**/

#include "Settings.h"
#include <QFile>
#include <QSettings>

Settings settings;


/**
 * Loads the application settings, or, if no saved settings are available, loads default values for
 * the settings. You can change the defaults here.
 */
void Settings::loadSettingsOrDefaults()
{
    // Set the default values below
    QSettings s;

    // Brush
    sceneType = s.value("sceneType", SCENE_SIMPLE).toInt();


    // Depth of view
    depthOfView = s.value("depthOfView", false).toBool();
    depthOfViewFocus = s.value("depthOfViewFocus", 10).toInt();

}

void Settings::saveSettings()
{
    QSettings s;

    // Scene
    s.setValue("sceneType", sceneType);


    // Depth of View
    s.setValue("depthOfView", depthOfView);
    s.setValue("depthOfViewFocus", depthOfViewFocus);

}

