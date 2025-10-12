# 🤖 AI Applications Extension

## 📌 Description

Chrome extension that provides quick and direct access to the main artificial intelligence applications from your browser. With a single click, access ChatGPT, Gemini, Google AI Studio, NotebookLM and Perplexity.

## ✨ Features

- **Quick access**: One click to open any AI tool
- **Intuitive interface**: Modern design with visual cards for each application
- **Visual effects**: Hover animations for better user experience
- **Custom background**: Attractive interface with AI-themed background image
- **Optimized**: Lightweight and fast, without affecting browser performance

## 🚀 Included Applications

| Application | Description | URL |
|-------------|-------------|-----|
| **ChatGPT** | OpenAI conversational AI assistant | <https://chatgpt.com> |
| **Gemini** | Google conversational AI | <https://gemini.google.com> |
| **Google AI Studio** | Google AI development platform | <https://aistudio.google.com> |
| **NotebookLM** | Google research and writing assistant | <https://notebooklm.google.com> |
| **Perplexity** | AI-powered search engine | <https://www.perplexity.ai> |

## 📂 Project Structure

```text
Extensión aplicaciones IA/
├── manifest.json          # Extension configuration
├── popup.html             # Main user interface
├── popup.js               # Interaction logic
├── icon48.png             # Extension icon
├── images/                # Graphic resources
│   ├── ...
└── README.md              
```

## 🛠️ Installation

### Manual Installation (Developer)

1. **Download**: Clone or download this repository

   ```bash
   git clone https://github.com/pelejebre/extensiones_chrome.git
   cd "extensiones_chrome/Extensión aplicaciones IA"
   ```

2. **Open Chrome**: Go to `chrome://extensions/`

3. **Developer Mode**: Enable "Developer mode" in the top right corner

4. **Load Extension**: Click "Load unpacked" and select the extension folder

5. **Ready!**: The extension will appear in your toolbar

## 🎯 Usage

1. **Click the icon**: Click the extension icon in the Chrome toolbar
2. **Select application**: Choose the AI application you want to use
3. **Direct access**: A new tab will open with the selected application

## 🔧 Customization

### Add New AI Application

To add a new AI application:

1. **Add image**: Place the logo in the `images/` folder
2. **Modify HTML**: Add a new button in `popup.html`:

   ```html
   <button class="ai-card new-app" data-url="https://new-app.com">
       <img src="images/_new_app.png" alt="New App">
   </button>
   ```

3. **Update CSS**: Add custom styles in `popup.html`

### Change Background

Replace `images/_background.jpg` with your preferred image (recommended: 600x400px)

## 🎨 Technologies Used

- **HTML5**: Interface structure
- **CSS3**: Styles and animations (Grid Layout, Flexbox, Transitions)
- **JavaScript**: Interaction logic and Chrome Extension APIs
- **Chrome Extension Manifest V3**: Modern extension configuration

## 🤝 Contributions

Contributions are welcome! If you want to:

- Add new AI applications
- Improve the design
- Optimize the code
- Report bugs

Please:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 Changelog

### v1.0.0

- ✨ Initial release
- 🎯 Quick access to 5 main AI applications
- 🎨 Modern interface with hover effects

## 📄 License

This project is **open source** and **completely free to use**. You can:

- ✅ **Use** the extension for any purpose
- ✅ **Modify** the code according to your needs
- ✅ **Distribute** copies of the project
- ✅ **Create derivatives** and improvements
- ✅ **Commercial use** without restrictions

**No attribution required**, although appreciated. This project is available under the **MIT License**, which guarantees maximum freedom of use.

## 👨‍💻 Author

**pelejebre** - [GitHub](https://github.com/pelejebre)

## 🌟 Like the project?

If you find this extension useful, give it a star ⭐ on the repository!