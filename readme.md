# Website Blocker Chrome Extension

A simple yet powerful Chrome extension that helps you stay focused by blocking distracting websites. Set up a password-protected list of blocked sites and boost your productivity.

## Features

- 🔒 Password protection for settings
- 🚫 Block any website with custom entries
- ⚡ Quick block preset for common social media sites
- 🎯 Clean, intuitive interface
- 🗑️ Easy unblocking with one click (you should not use this)

## Installation

### Developer Mode Installation
1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" in the top left corner
5. Select the folder containing the extension files


1. **Initial Setup**
   - After installation, click the extension icon in your Chrome toolbar
   - Set up a password (minimum 6 characters) to protect your settings
   - This password will be required to make changes to blocked sites

2. **Blocking Websites**
   - Enter the website domain (e.g., "facebook.com") in the input field
   - Click "Block Website" to add it to your blocked list
   - Use the "Block Basic Social Media" preset to quickly block common social media sites

3. **Managing Blocked Sites**
   - View all blocked websites in the list below the input field
   - Click the "×" button next to any site to unblock it
   - Use the "Change Password" button to update your password

4. **Social Media Preset**
   The preset button automatically blocks:
   - facebook.com
   - twitter.com
   - youtube.com
   - instagram.com

## Security Notes

- The extension uses Chrome's sync storage to save settings
- Passwords are stored locally and sync across your Chrome instances
- The blocking mechanism is client-side and can be circumvented by disabling the extension
- This tool is designed for self-regulation rather than strict access control

## Development

### Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Chrome Extension APIs

### Customization
To modify the social media preset list, edit the `SOCIAL_MEDIA_SITES` object in `popup.js`:

```javascript
const SOCIAL_MEDIA_SITES = {
  'facebook.com': true,
  'twitter.com': true,
  'youtube.com': true,
  'instagram.com': true,
  // Add more sites here
};
```

