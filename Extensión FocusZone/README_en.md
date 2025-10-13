# 🍅 FocusZone - Pomodoro blocker

**FocusZone** is a Chrome extension that helps you maintain your focus by blocking distracting websites during Pomodoro-style sessions (e.g., 25 minutes of focus, 5 minutes of rest).

## 🎯 What is FocusZone?

FocusZone is a productivity tool based on the **Pomodoro Technique**, which consists of working in focused time intervals (25 minutes by default) followed by short breaks (5 minutes).

### How does it work?

1. **Start a focus session** of 25 minutes
2. **During those 25 minutes**, FocusZone automatically blocks distracting websites (YouTube, social media, etc.)
3. If you try to visit a blocked site, you'll see a **motivational page** reminding you to stay focused
4. After completing the 25 minutes, you receive a **notification** and a 5-minute break begins
5. **During the break**, all sites are available - you can relax without restrictions

## ✨ Features

### 🎯 Pomodoro timer
- **25 minutes of focus** followed by **5 minutes of rest**
- Fully configurable times according to your needs
- Clear visual interface with countdown timer
- Start/Pause/Reset buttons

### 🚫 Smart site blocking
- Automatically blocks distracting sites during focus mode
- Default list includes: YouTube, X/Twitter, TikTok, Instagram, Facebook, Reddit, Twitch, WhatsApp Web, Gmail
- **Fully customizable list**: add or remove sites according to your needs
- Blocked sites show a motivational page instead of the content

### 📊 Productivity tracking
- Counter of sessions completed per day
- Statistics of blocks avoided
- Notifications when completing sessions

### 🎨 Modern interface
- Clean and professional design with gradients
- Visual indicator of status (active/inactive)
- Responsive and easy to use

## 🚀 Installation

### Option 1: Manual installation (developer mode)

1. **Download this folder** or clone the repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right corner)
4. Click **Load unpacked extension**
5. Select the `Extensión FocusZone` folder
6. Done! The FocusZone icon will appear in your toolbar

### Option 2: Download only this extension

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/pelejebre/extensiones_chrome.git
cd extensiones_chrome
git sparse-checkout set "Extensión FocusZone"
```

## 📖 How to use

### Initial setup

1. **Configure times**: Default is 25 min focus and 5 min break
   - You can change them in the "⚙️ Time Configuration" section
   
2. **Customize blocked sites**:
   - The extension includes common sites already blocked
   - Add new sites by typing the domain (e.g., `reddit.com`) and clicking "+ Add"
   - Remove sites you don't want to block with the "Remove" button

### Using the timer

1. **Start session**: Click the **"▶ Start"** button
   - The indicator will turn red (active mode)
   - Blocked sites will no longer be accessible
   
2. **During the session**:
   - The timer counts down
   - If you try to visit a blocked site, you'll see a motivational warning page
   - You can pause at any time with **"⏸ Pause"**
   
3. **Complete the session**:
   - When finished, you'll receive a notification
   - The mode will automatically change to "Break"
   - During the break, all sites are available
   
4. **Reset**: The **"⟲ Reset"** button returns everything to 25 minutes of focus

### Block page

When you try to access a blocked site during focus mode, you'll see:
- 🚫 Animated block icon
- Motivational phrase
- Button to go back

## 🛠️ Technologies

- **Chrome Extension Manifest V3**
- **Service Worker** for background script
- **Chrome Storage API** for configuration and statistics
- **Chrome WebNavigation API** to intercept navigation
- **Chrome Notifications API** for alerts
- **HTML5/CSS3/JavaScript vanilla** (no frameworks)

## 📁 Project structure

```
Extensión FocusZone/
├── manifest.json         # Extension configuration
├── popup.html            # Popup interface
├── popup.js              # Popup and timer logic
├── background.js         # Service worker (site blocking)
├── blocked.html          # Page shown on blocked sites
├── icon.png              # Extension icon
└── README.md             
```

## ⚙️ Required permissions

- **storage**: Save configuration and statistics
- **tabs**: Manage tabs to redirect blocked sites
- **webNavigation**: Intercept navigation to blocked sites
- **notifications**: Show alerts when completing sessions
- **alarms**: Keep service worker active
- **host_permissions** (`<all_urls>`): Necessary to block any site

## 🔧 Use cases

### Student

```
1. Configure 50 minutes of focus, 10 minutes break
2. Add specific sites like Discord or Telegram
3. Start session before studying for an exam
4. Maintain focus for 50 minutes without distractions
```

### Home office professional

```
1. Use the standard 25 minutes
2. Block email (gmail.com) during intense sessions
3. Work 2-3 consecutive Pomodoro sessions with breaks
4. Check emails only during breaks
```

### Writer/creative

```
1. Configure long sessions (60-90 minutes)
2. Block social media and news
3. Write without interruptions
4. Rest 15 minutes to recharge creativity
```

## ❓ Frequently asked questions

### What happens if I close the popup?

The timer **keeps running** in the background. Sites will remain blocked until the session ends or you pause it.

### Can I use FocusZone in incognito mode?

Yes, but you must enable it manually:

1. Go to `chrome://extensions/`
2. Find FocusZone
3. Click "Details"
4. Enable "Allow in incognito"

### Does it work with other browsers?

Only Chrome and Chromium-based browsers (Edge, Brave, Opera).

### Are sites blocked if I pause the timer?

No. They're only blocked when the timer is **active** (red indicator) and in **focus mode**.

### Can I remove sites from the default list?

Yes. Simply click "Remove" next to the site you don't want to block.

### How do I add sites with subdomains?

Just write the main domain. For example:

- Writing `reddit.com` will block all Reddit pages
- You don't need to add `www.reddit.com` separately

## 🐛 Troubleshooting

### Sites are not being blocked

**Check:**

1. Is the timer **started**? (button should say "Pause", not "Start")
2. Is the indicator **RED**? (if it's gray, the timer is not active)
3. Does it say "🎯 Focus Mode"? (if it says "Break", it doesn't block)
4. Is the site in the blocked list?

**Solutions:**

- Reload the extension at `chrome://extensions/`
- Close and open the popup again
- Click "Reset" and then "Start" again

### Notifications don't appear

1. Go to Chrome Settings → Privacy and security → Notifications
2. Make sure Chrome can show notifications
3. Find "FocusZone" and allow notifications

### Timer stops on its own

Chrome's service worker may pause. To verify:

1. Go to `chrome://extensions/`
2. Find FocusZone
3. Click "Service worker"
4. Check the console for errors

## 📊 Statistics

In the popup you'll see:

- **Sessions completed today**: Counter that updates each time you complete a 25-minute focus session

## 🎨 Customization

### Change times

Times can be changed directly in the popup without editing code:

1. Open the popup
2. Change the values in "⚙️ Time Configuration"
3. Changes are saved automatically


## 📝 Version

**Version 1.0** - October 2025

## 👨‍💻 Author

**pelejebre**

- GitHub: [@pelejebre](https://github.com/pelejebre)

## 🙏 Credits

- Based on the **Pomodoro Technique** by Francesco Cirillo
- Design inspired by modern productivity tools

---

## 💡 Productivity tips

### Effective pomodoro technique

1. **Plan ahead**: Decide what you'll do in each session
2. **No multitasking**: One task per session
3. **Respect breaks**: They're an essential part of the method
4. **4 sessions = long break**: After 4 Pomodoros, take 15-30 minutes
5. **Eliminate physical distractions**: Not just digital (phone on airplane mode, etc.)

### Improve your focus

- **Mornings**: Longer sessions (50 min) for difficult tasks
- **Afternoons**: Standard sessions (25 min) for routine tasks
- **Customize the list**: Block ONLY the sites that really distract you
- **Use statistics**: Celebrate each completed session

---

**Boost your productivity and stay focused with FocusZone! 🍅✨**
