# Rutube Web Translator User Guide

## Introduction

Welcome to Rutube Web Translator, an application that allows you to watch YouTube videos while providing real-time Russian translation of English speech. This guide will help you get started with both the web application and the desktop version.

## Table of Contents

1. [Web Application Usage](#web-application-usage)
2. [Desktop Application Usage](#desktop-application-usage)
3. [Features Overview](#features-overview)
4. [Troubleshooting](#troubleshooting)
5. [Frequently Asked Questions](#frequently-asked-questions)

## Web Application Usage

### Accessing the Web Application

1. Visit the application at [https://github.com/serkac1000/Rutube-Web](https://github.com/serkac1000/Rutube-Web)
2. The application will load in your browser, and you'll see the main interface.

### Getting Started with the Web App

1. **Enter a YouTube URL**: Paste a YouTube video URL in the input field.
2. **Load the Video**: Click the "Load" button to load the video.
3. **Start Playback**: Use the video controls to play, pause, and adjust volume.
4. **Enable Translation**: Click the "Start Translation" button to begin translating the video's English audio to Russian.
5. **View Translations**: Translations will appear in the translation panel below the video.

## Desktop Application Usage

### Installation

#### Windows

1. Download the latest Windows installer (.exe) from the [releases page](https://github.com/serkac1000/Rutube-Web/releases).
2. Run the installer and follow the prompts.
3. Once installed, you can launch the application from the Start menu or desktop shortcut.

#### macOS

1. Download the latest macOS disk image (.dmg) from the [releases page](https://github.com/serkac1000/Rutube-Web/releases).
2. Open the disk image and drag the application to your Applications folder.
3. Launch the application from the Applications folder or Launchpad.

#### Linux

1. Download the latest AppImage from the [releases page](https://github.com/serkac1000/Rutube-Web/releases).
2. Make the AppImage executable: `chmod +x Rutube_Web_Translator*.AppImage`
3. Run the AppImage: `./Rutube_Web_Translator*.AppImage`

### Using the Desktop Application

The desktop application works identically to the web application but runs as a standalone program on your computer. This means:

- No browser is required
- The application can work offline (though you still need internet access for YouTube videos)
- The application starts faster and is optimized for desktop use

## Features Overview

### Video Player

- **Video URL Input**: Enter any valid YouTube video URL
- **Playback Controls**: Play, pause, and adjust volume
- **Full Integration**: Seamless integration with YouTube's video player

### Translation Engine

- **Real-time Translation**: Translates English speech to Russian in real-time
- **Transcript History**: Keeps a history of all translations
- **Timestamp Tracking**: Each translation is timestamped for reference

### User Interface

- **Status Indicators**: Shows the current status of player, recognition, and translation
- **Responsive Design**: Works on various screen sizes
- **Dark/Light Mode**: Automatically adapts to your system theme

## Troubleshooting

### Web Application Issues

- **Video Not Loading**: Ensure the YouTube URL is valid and the video is publicly available.
- **Translation Not Working**: Check that your browser allows microphone access for speech recognition.
- **Playback Issues**: Try refreshing the page or using a different browser.

### Desktop Application Issues

- **Application Won't Start**: Ensure your system meets the minimum requirements.
- **Video Not Loading**: Check your internet connection.
- **Translation Not Working**: Restart the application.
- **Black Screen**: If you see a black screen, try restarting the application.

## Frequently Asked Questions

### General

**Q: What languages are supported?**  
A: Currently, the application translates from English to Russian. Support for additional languages may be added in future updates.

**Q: Does the application store any data?**  
A: No, all translations happen in-memory and are not stored beyond your current session.

**Q: Is an internet connection required?**  
A: Yes, an internet connection is needed to load YouTube videos and for the translation services.

### Web App Specific

**Q: Which browsers are supported?**  
A: Modern versions of Chrome, Firefox, Edge, and Safari are supported. Chrome provides the best experience.

**Q: Can I use the web app on mobile devices?**  
A: Yes, but desktop browsers provide the best experience due to better support for speech recognition.

### Desktop App Specific

**Q: Will the desktop app auto-update?**  
A: No, you will need to download and install new versions manually.

**Q: How much disk space does the desktop app require?**  
A: The application requires approximately 200MB of disk space.

**Q: Can I use the desktop app without an internet connection?**  
A: The app can start without an internet connection, but you'll need internet access to load YouTube videos and use translation features.

---

For more information or to report issues, please visit the [GitHub repository](https://github.com/serkac1000/Rutube-Web).