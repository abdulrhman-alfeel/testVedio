# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# Keep JavaScript modules
-keep class com.facebook.react.jscexecutor.** { *; }
-keep class com.facebook.react.modules.core.** { *; }

# Keep Android classes
-keep class android.support.** { *; }
-keep class android.widget.** { *; }
-keep class android.view.** { *; }
-keep class android.content.** { *; }

# Keep React Native's JavaScript engine
-keep class org.javascriptcore.** { *; }

# Keep React Native's JavaScript modules
-keep class com.facebook.react.devsupport.** { *; }
-keep class com.facebook.react.packager.** { *; }

# Keep React Native's native modules
-keep class com.facebook.react-native.** { *; }