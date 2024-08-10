### README

# Graduation Project App

This project is a React Native application utilizing various libraries to enhance its functionality. Follow the instructions below to set up and run the project.

## Installation Instructions

1. **Install the required packages:**
   ```sh
   npm i react-native-gifted-charts
   npm i react-native-linear-gradient
   npm i react-native-svg
   npm i @react-navigation/native
   npm i @react-navigation/stack
   npm i react-native-screens
   npm i react-native-safe-area-context
   npm i @react-navigation/bottom-tabs
   npm i @react-native-firebase/app @react-native-firebase/messaging
   npm i --save-dev @types/react-native-vector-icons
   npm i react-native-toast-message
   npm i react-native-vision-camera
   npm i react-native-paper
   npm i react-native-image-picker
   npm i react-native-element-dropdown
   npm i react-native-maps
   npm i react-native-gesture-handler
   npm i react-native-keychain
   npm i @react-native-async-storage/async-storage
   npm i @react-native-firebase/app
   npm i @react-native-firebase/messaging
   npm i @react-navigation/material-top-tabs react-native-tab-view
   npm i react-native-pager-view
   npm i react-native-app-intro-slider
   npm i @gorhom/bottom-sheet
   npm i react-native-reanimated react-native-gesture-handler
   npm i react-native-video
   npm install react-native-geolocation-service
   npm install react-native-permissions
   ```

2. **Add the following code snippet at the bottom of the file `android/app/build.gradle`:**
   ```gradle
   apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
   apply plugin: 'com.google.gms.google-services’
   ```
3. **Add the following code snippet in the dependency tags of the file `android/build.gradle`:**
   ```gradle
   classpath 'com.google.gms:google-services:4.3.13'
   ```

4. **Configure API key and permissions:**
   In the `android/app/src/main/AndroidManifest.xml` file, inside the `<application ...>...</application>` tag, add the following lines:
   ```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="Replace this with your API key"/>
   <uses-library android:name="org.apache.http.legacy" android:required="false"/>
   ```

5. **Add required permissions:**
   In the `AndroidManifest.xml` file, inside the `<manifest>` tag, add the following lines:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <!--背景通知-->
   <uses-permission android:name="android.permission.VIBRATE" />
   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
   
   <!--背景通知-->

   <!--取得位置-->
   <!-- Define ACCESS_FINE_LOCATION if you will use enableHighAccuracy=true  -->
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
   <!-- Define ACCESS_COARSE_LOCATION if you will use enableHighAccuracy=false  -->
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
   <!--取得位置-->

   <!--取得影像-->
   <uses-permission android:name="android.permission.CAMERA"/>
   <uses-permission android:name="android.permission.RECORD_AUDIO"/>
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
   <!--取得影像-->
   ```

6. **Modify `VisionCameraProxy.kt`:**
   In the `./node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/frameprocessors/VisionCameraProxy.kt` file, add the following import statement:
   ```kotlin
   import com.facebook.react.common.annotations.FrameworkAPI

   @OptIn(FrameworkAPI::class)
   ```

7. **Import the project in `index.js`:**
   In the `index.js` file, add the following import statement:
   ```javascript
   import Project from './Graduation-Project-App';
   ```
8. **Add `react-native-reanimated/plugin` plugin to your `babel.config.js`**
   In the `babel.config.js` file, add the `react-native-reanimated/plugin` into plugins and restart your project with following instructions `npm start --reset-cache`
   ```kotlin
   plugins: [
      ...
      'react-native-reanimated/plugin',
    ],
   ```


## Additional Information

Ensure you have all necessary environment setups like Android SDK, Node.js, and other dependencies required for React Native development.

For any issues, refer to the documentation of the respective libraries or seek help from their communities.

---

This README provides a step-by-step guide for setting up the Graduation Project App, making sure that the necessary configurations and dependencies are properly installed and configured.

