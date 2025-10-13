# 💪 FocusBreak

## 📌 Description

**FocusBreak** is a Chrome extension designed to take care of your physical and mental health while working at your computer. It offers customizable periodic reminders for active breaks and a guided breathing system based on the 4-7-8 technique, which helps reduce stress and improve focus. Ideal for remote workers, students, programmers, and anyone who spends long hours in front of a screen.

## ✨ Main Features

* **🔔 Customizable reminders**: Set work intervals from 5 to 120 minutes
* **🧘 4-7-8 Guided Breathing**: Breathing exercise with visual animation and guiding sounds
* **🎯 Automatic popup window**: Opens a dedicated window for guided breathing
* **🔊 Sound feedback**: Specific tones for each breathing phase (inhale, hold, exhale)
* **📊 Daily tracking**: Counter of breaks taken during the day
* **🎨 Visual animation**: Expanding and contracting circle following the breathing rhythm
* **🔇 Sound control**: Button to mute tones during the exercise
* **💡 Integrated tips**: Advice on active breaks, ergonomics, and hydration
* **🚀 Lightweight and fast**: Minimal permissions, no website access

## 🧘 4-7-8 Breathing Technique

| Phase          | Duration      | Frequency | Description                     |
| -------------- | ------------- | --------- | ------------------------------- |
| 🌬️ Inhalation | 4 seconds     | 400 Hz    | Inhale deeply through the nose  |
| 🫁 Retention   | 7 seconds     | 600 Hz    | Hold the air in your lungs      |
| 💨 Exhalation  | 8 seconds     | 300 Hz    | Slowly exhale through the mouth |
| 🔄 Cycles      | 5 repetitions | -         | Total: ~1.5 minutes of exercise |

This technique, developed by Dr. Andrew Weil, activates the parasympathetic nervous system, reducing anxiety and improving mental focus.

## 📂 Project Structure

```
FocusBreak Extension/
├── manifest.json        # Manifest V3 configuration
├── background.js        # Service Worker (alarms, notifications, windows)
├── popup.html           # Configuration and breathing interface
├── popup.js             # UI logic and breathing exercise
├── icon.png             # Extension icon
└── README.md            
```

## 🛠️ Installation

### Option 1: Manual installation (developer mode)

1. Download this folder from the repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right corner)
4. Click **Load unpacked extension**
5. Select the `FocusBreak Extension` folder
6. Done! The 💪 icon will appear in the toolbar

### Option 2: Selective download (Git sparse checkout)

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/pelejebre/extensiones_chrome
cd extensiones_chrome
git sparse-checkout set "Extensión FocusBreak"
```

Then follow steps 2–6 from the manual option.

## 🎯 Usage

### 1. Initial setup

* Click the 💪 FocusBreak icon in the toolbar
* Set the **work interval** (minutes between breaks): 5–120 min
* Set the **suggested break duration**: 5–30 min
* Click **▶ Activate reminders**

### 2. During work

* FocusBreak runs in the background
* You'll receive periodic motivational notifications
* The daily break counter updates automatically

### 3. When the alarm rings

The notification offers two options:

* **🧘 Guided breathing**: Automatically opens a window for the 4-7-8 exercise
* **☕ Free break**: Close the notification and rest at your own pace

### 4. Breathing exercise

* Opens a dedicated 420x600px window
* Animated circle visually guides each phase
* Sound tones mark the beginning of each phase
* Use 🔇 to mute sounds
* Complete 5 cycles (~1.5 minutes) or exit early with ❌

**Technical note**: If the window doesn’t open automatically (Manifest V3 limitation), a second notification will appear telling you to click the extension icon to access the exercise.

## 💡 Use Cases

| Profile          | Recommended Interval | Context                     |
| ---------------- | -------------------- | --------------------------- |
| 👨‍💻 Programmer | 50–60 min            | Extended Pomodoro technique |
| 📚 Student       | 30–45 min            | Intensive study sessions    |
| 💼 Office worker | 60–90 min            | Standard office work        |
| 🎮 Gamer         | 45–60 min            | Visual fatigue prevention   |

## ❓ FAQ

**How does the notification system work?**

* FocusBreak uses Chrome's Alarms API to schedule periodic reminders efficiently.

**Why doesn't the breathing window open automatically?**

* Chrome Manifest V3 has security restrictions preventing automatic popups from service workers. FocusBreak implements a **dual system**: it first attempts to open the window automatically, and if it fails, shows a secondary notification asking you to click the extension icon.

**Do reminders work if I close the popup?**

* Yes, the service worker in `background.js` keeps alarms active even if you close the popup or restart the browser.

**Can I customize intervals?**

* Yes, adjust values in the popup between 5–120 minutes for work and 5–30 minutes for breaks.

**Does the extension use many resources?**

* No, it uses minimal permissions and the service worker only activates when alarms are scheduled.

## 🔧 Troubleshooting

### Notifications not appearing

* Make sure Chrome notifications are enabled in your OS
* Check `chrome://settings/content/notifications` to ensure the extension has permission

### Breathing window not opening automatically

* **Expected behavior**: Manifest V3 limitations may prevent auto-opening
* **Solution**: When you see "🧘 Guided breathing ready," click the 💪 FocusBreak icon
* The extension will automatically detect and display the breathing exercise

### No sound

* Check that 🔇 Mute is not enabled
* Verify system volume
* Some browsers require user interaction before playing audio (click the window)

## 🎨 Customization

### Modify intervals

Edit default values in `background.js` (lines 10–12):

```javascript
workInterval: 50,  // work minutes
breakDuration: 10, // break minutes
```

### Add notification messages

Add motivational phrases in `background.js` (lines 71–80):

```javascript
const messages = [
    '💪 Your custom message here!',
    // ... more messages
];
```

### Adjust breathing technique

Modify durations in `popup.js` (function `runBreathingCycle`, lines ~220–250):

```javascript
// Phase 1: Inhalation (4 seconds default)
// Phase 2: Retention (7 seconds default)
// Phase 3: Exhalation (8 seconds default)
```

### Change sound frequencies

Edit `playSound()` calls in `popup.js`:

```javascript
playSound(400, 500);  // Frequency in Hz, duration in ms
```

## 🚀 Technologies Used

* **Chrome Extension Manifest V3**: Modern architecture with service workers
* **Chrome Alarms API**: Efficient periodic reminders
* **Chrome Notifications API**: Interactive notifications with buttons
* **Chrome Storage API**: Local configuration persistence
* **Chrome Windows API**: Programmatic popup window creation
* **Web Audio API**: Real-time sine wave tone generation
* **CSS3 Animations**: Smooth transitions with `transform: scale()`
* **Vanilla JavaScript**: Lightweight code, no external dependencies

## 🔒 Permissions

| Permission                  | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `alarms`                    | Schedule periodic break reminders       |
| `notifications`             | Display interactive notifications       |
| `storage`                   | Save user settings (intervals, counter) |
| `system.display` (optional) | Improve popup window control            |

**Privacy**: FocusBreak does **NOT** access your tabs, browsing history, or personal data. All settings are stored locally in your browser.

## 🛡️ Privacy

* ✅ **No web access**: Does not use `tabs`, `webNavigation`, or `activeTab` permissions
* ✅ **Local storage**: All data stays on your device
* ✅ **No internet connection**: No external data transmission
* ✅ **Open source**: Review the source code for transparency

## 🌐 Compatibility

| Browser | Compatible | Notes                                 |
| ------- | ---------- | ------------------------------------- |
| Chrome  | ✅          | Fully functional                      |
| Edge    | ✅          | Chromium-based                        |
| Brave   | ✅          | Chrome extension compatible           |
| Opera   | ✅          | Supports Manifest V3                  |
| Firefox | ❌          | Uses Manifest V2, requires adaptation |

**Minimum version**: Chrome 88+ (released January 2021)

## 🤝 Contributions

Contributions are welcome! To improve FocusBreak:

1. Fork the repository
2. Create a branch for your feature
3. Make your changes and commit
4. Push your changes
5. Open a **Pull Request** describing your improvements

### Contribution ideas

* 🌍 Translations into other languages
* 🎵 New sound patterns (ambient, nature)
* 🧘 Alternative breathing techniques (Box Breathing, Wim Hof)
* 📊 Statistic charts (weekly breaks, productivity)
* 🎨 Visual themes (dark mode, customizable colors)

## 📄 License

This project is open-source and distributed under the **MIT License**. You may use, modify, and distribute the extension, even commercially, as long as you keep the original copyright notice.

## 👨‍💻 Author

**pelejebre**
GitHub: [@pelejebre](https://github.com/pelejebre)

---

## 🌟 Like the project?

If FocusBreak helps you take care of your health while working, give the repository a ⭐!
Your support motivates further development.

**Take care of your health — one break at a time! 💪🧘**
