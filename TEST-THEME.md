# Theme System Test

## Steps to Test:

### 1. Restart the Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Open Browser Console
- Press F12
- Go to Console tab
- Check for any errors

### 3. Test Theme Changes
1. Go to Settings → Personalization
2. Open browser console (F12)
3. Type: `localStorage.getItem('colorTheme')`
4. Should show current theme

### 4. Change Theme
1. Click "Cyberpunk" theme
2. Check console: `localStorage.getItem('colorTheme')`
3. Should show: "cyberpunk"

### 5. Check CSS Variables
In console, type:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
```
Should show the color value

### 6. Force Refresh
- Press Ctrl+Shift+R (hard refresh)
- Theme should persist

## If Still Not Working:

### Check 1: Clear localStorage
```javascript
localStorage.clear()
location.reload()
```

### Check 2: Verify ThemeProvider
Check if ThemeProvider is wrapping the app in browser React DevTools

### Check 3: Check Console Errors
Look for any red errors in console

## Expected Behavior:
- Clicking theme changes localStorage
- CSS variables update in :root
- Background colors change
- Font changes apply
- Wallpaper appears

## Debug Commands:
```javascript
// Check all theme settings
console.log({
  theme: localStorage.getItem('theme'),
  colorTheme: localStorage.getItem('colorTheme'),
  fontFamily: localStorage.getItem('fontFamily'),
  fontSize: localStorage.getItem('fontSize'),
  wallpaper: localStorage.getItem('wallpaper')
});

// Check CSS variables
const root = document.documentElement;
console.log({
  bgPrimary: getComputedStyle(root).getPropertyValue('--bg-primary'),
  colorPrimary: getComputedStyle(root).getPropertyValue('--color-primary'),
  fontFamily: getComputedStyle(root).getPropertyValue('--font-family')
});
```
