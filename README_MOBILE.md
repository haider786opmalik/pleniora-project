# Pleniora Mobile App (Android APK & iOS Offline)

This project has been packaged as a fully offline-first native mobile application for **Android (APK)** and **iOS (Xcode / IPA)** powered by [Capacitor](https://capacitorjs.com/).

---

## 📱 Features & Mobile Optimizations

- **100% Standalone Offline**: Runs entirely on the device without requiring any server, internet connection, or Wi-Fi. All business records, products, customers, suppliers, inventory, sales, and reports are saved directly to device-level persistent storage (`localStorage` / WebView LevelDB).
- **Point of Sale (POS)**: Fast checkout, multi-tender split payments (Cash, Card, Bank, Credit), receipt printing/preview, and category navigation.
- **Built-in Camera Barcode Scanner**: Tap **📷 Scan** in the POS register to open the device camera with an automated targeting reticle. It automatically detects barcodes (UPC, EAN-13, Code 128, QR Code, etc.) and adds the item to the cart with haptic vibration feedback.
- **Hardware Scanner & USB Gun Support**: Fully compatible with Bluetooth or USB handheld barcode guns (inputs straight into the search box with `Enter`).
- **All 11+ Business Profiles**: General Retail, Clothing & Fabrics, Restaurant & Cafe, Pharmacy & Medical, Grocery & Supermarket, Electronics & Appliances, Bakery & Food, Wholesale & Distribution, Hardware & Building, Auto Parts, Salon & Services.
- **Mobile Hardware & UI Handling**:
  - Safe-area insets configured for iPhone notch, Dynamic Island, and Android gesture navigation bars (`viewport-fit=cover`).
  - Android hardware back button handler: closes active camera scanner, open dialogs, or mobile navigation drawer without quitting the app accidentally.
  - Native status bar colored in the brand primary color (`#6F12A0`).
- **Complete Business Suite**: Dashboard, Inventory adjustments/transfers, Table tickets & Kitchen queue, Ledgers & Accounts, Cash Register float/close, Daily Expenses, Sales reports, and Tasks & Alerts.
- **Local Backup & Restore**: One-tap full JSON backup download and restore under **Settings & Backup** (`⚙`).

---

## 🛠️ Project Structure

```text
pleniora-project/
├── android/                    # Native Android Studio & Gradle project
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml # Permissions (INTERNET, CAMERA, VIBRATE)
│   │   ├── assets/public/      # Bundled offline web assets inside the APK
│   │   └── res/mipmap-*/       # Generated app icons (all densities)
│   └── build.gradle
├── ios/                        # Native iOS Xcode project
│   ├── App/
│   │   ├── App/public/         # Bundled offline web assets inside the iOS app
│   │   ├── App/Info.plist      # Camera usage permissions
│   │   └── App/Assets.xcassets # 1024x1024 iOS AppIcon
│   └── App.xcworkspace
├── www/                        # Offline mobile web distribution bundle
│   ├── index.html              # Mobile entry point (offline auto-boot)
│   ├── css/style.css           # Mobile safe-area & responsive styling
│   ├── js/                     # Offline business logic & scanner
│   └── icons/                  # High-resolution brand icons
├── .github/workflows/
│   └── build-mobile.yml        # Automated cloud CI/CD builder for APK & iOS
├── capacitor.config.json       # Capacitor configuration
├── build-mobile.js             # Asset builder & sync script
└── package.json                # NPM scripts and dependencies
```

---

## 🚀 How to Build

### 1. Synchronize Web Code to Native Projects

Whenever you make any changes to HTML, CSS, or JS files, run:

```powershell
npm run sync
```

This compiles your changes into `www/` and updates both `android/` and `ios/` native asset directories in ~1 second.

---

### 2. Building the Android APK

#### Option A: Using Android Studio (Recommended for local testing & signing)

1. Open the project in Android Studio by running:
   ```powershell
   npm run open:android
   ```
   *(or open the `android` folder in Android Studio manually)*.
2. In Android Studio:
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - When finished, Android Studio shows a notification with a **locate** button to open `app-debug.apk`.
   - Transfer this `.apk` to any Android phone or tablet and tap to install!

#### Option B: From Command Line (If Android SDK & JDK 17 are installed)

```powershell
cd android
./gradlew.bat assembleDebug
```
The output APK will be at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

### 3. Building the iOS App

#### Option A: Using Xcode on a Mac

1. Open the project in Xcode by running:
   ```bash
   npm run open:ios
   ```
   *(or open `ios/App/App.xcworkspace` in Xcode)*.
2. Select your target device (iPhone / iPad or Simulator).
3. Select your development team in **Signing & Capabilities**.
4. Click **Product** → **Run** to launch on a connected device/simulator, or **Product** → **Archive** to export an `.ipa` or distribute via TestFlight.

---

### 4. Cloud Build via GitHub Actions (Zero Local SDKs Required)

A complete automated build workflow has been included in `.github/workflows/build-mobile.yml`.

1. Push this folder to a GitHub repository (`git init`, commit, and push to GitHub).
2. Go to the **Actions** tab on your GitHub repository.
3. Select **Build Mobile Apps (Android APK & iOS)** and click **Run workflow**.
4. GitHub will build the APK on an Ubuntu runner and the iOS project on a macOS runner.
5. Once complete, download the generated **`pleniora-pos-debug-apk`** artifact directly from the GitHub Actions run summary page!

---

## 🔒 Offline Data & Reset Notes

- All data is preserved across app closes and phone restarts in the app's sandboxed local database.
- To export a backup, go to **Settings & Backup** (`⚙`) → **Download Backup**.
- If you ever wish to clear all data and reset to initial factory settings, use **Settings & Backup** → **Reset Data**.
