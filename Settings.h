/**
 * @file    Settings.h
 *
 * This file contains various settings and enumerations that you will need to use in the various
 * assignments. The settings are bound to the GUI via static data bindings.
 */

#ifndef SETTINGS_H
#define SETTINGS_H

#include <QObject>

// Enumeration values for the Brush types from which the user can choose in the GUI.
enum SceneType
{
    SCENE_SIMPLE,
    SCENE_CORNELL_BOX,
    SCENE_SPECIAL_1,
    NUM_SCENE_TYPES
};











/**
 * @struct Settings
 *
 * Stores application settings for the CS123 GUI.
 *
 * You can access all app settings through the "settings" global variable.
 * The settings will be automatically updated when things are changed in the
 * GUI (the reverse is not true however: changing the value of a setting does
 * not update the GUI).
*/
struct Settings
{
    // Loads settings from disk, or fills in default values if no saved settings exist.
    void loadSettingsOrDefaults();

    // Saves the current settings to disk.
    void saveSettings();

    // Scene
    int sceneType;      // The user's selected scene @see SceneType

    //DepthOfView
    bool depthOfView;
    int depthOfViewFocus;


};

// The global Settings object, will be initialized by MainWindow
extern Settings settings;

#endif // SETTINGS_H
