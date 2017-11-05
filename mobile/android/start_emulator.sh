echo "Starting Android Studio emulator"
$ANDROID_HOME/tools/emulator -avd $(emulator -list-avds | head -n 1)