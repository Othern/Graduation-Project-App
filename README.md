### README

# Graduation Project App

This project is a React Native application utilizing various libraries to enhance its functionality. Follow the instructions below to set up and run the project.

## Installation Instructions

1. **Install the required packages:**
   ```sh
   npm install react-native-gifted-charts
   npm install react-native-linear-gradient
   npm install react-native-svg
   npm install @react-navigation/native
   npm i @react-navigation/stack
   npm install react-native-screens
   npm install react-native-safe-area-context
   npm install @react-navigation/bottom-tabs
   npm install react-native-vector-icons
   npm install --save-dev @types/react-native-vector-icons
   npm i react-native-toast-message
   npm i react-native-vision-camera
   npm i react-native-paper
   npm i react-native-image-picker
   npm i react-native-element-dropdown
   npm i react-native-maps
   ```

2. **Add configuration for `react-native-vector-icons`:**
   Add the following code snippet at the bottom of the file `android/app/build.gradle`:
   ```gradle
   apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
   ```

3. **Configure API key and permissions:**
   In the `android/app/src/main/AndroidManifest.xml` file, inside the `<application ...>...</application>` tag, add the following lines:
   ```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="Replace this with your API key"/>
   <uses-library android:name="org.apache.http.legacy" android:required="false"/>
   ```

4. **Add required permissions:**
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

5. **Modify `VisionCameraProxy.kt`:**
   In the `./node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/frameprocessors/VisionCameraProxy.kt` file, add the following import statement:
   ```kotlin
   import com.facebook.react.common.annotations.FrameworkAPI

   @OptIn(FrameworkAPI::class)
   ```

6. **Import the project in `index.js`:**
   In the `index.js` file, add the following import statement:
   ```javascript
   import Project from './Graduation-Project-App';
   ```

## Additional Information

Ensure you have all necessary environment setups like Android SDK, Node.js, and other dependencies required for React Native development.

For any issues, refer to the documentation of the respective libraries or seek help from their communities.

---

This README provides a step-by-step guide for setting up the Graduation Project App, making sure that the necessary configurations and dependencies are properly installed and configured.
