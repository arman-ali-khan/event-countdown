# Event Countdown Builder - User Documentation

A modern, responsive Event Countdown Page Builder built with React, Vite, and TailwindCSS. Create beautiful countdown pages for weddings, birthdays, product launches, and any special event.

## 🚀 Features

- **Beautiful Countdown Timers**: Animated countdown displays with Days, Hours, Minutes, and Seconds
- **Event Type Presets**: Pre-designed themes for weddings, birthdays, product launches, and custom events
- **Custom Backgrounds**: Upload your own background images or use beautiful gradient defaults
- **Social Sharing**: Share countdown pages on Facebook, Twitter, WhatsApp, or copy direct links
- **Dark/Light Mode**: Automatic theme switching with manual toggle option
- **Fully Responsive**: Perfect display on desktop, tablet, and mobile devices
- **SEO Optimized**: Dynamic meta tags for social media sharing previews
- **Public Event Gallery**: Showcase recent public countdown events

## 📋 System Requirements

- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (or yarn 1.22+)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Installation Guide

### Step 1: Download and Extract
1. Download the theme package
2. Extract the ZIP file to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Step 3: Start Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Step 4: Build for Production
```bash
# Using npm
npm run build

# Using yarn
yarn build
```

Built files will be in the `dist/` directory.

## 📁 Project Structure

```
event-countdown-builder/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── CountdownTimer.tsx
│   │   ├── EventForm.tsx
│   │   ├── EventGrid.tsx
│   │   ├── Header.tsx
│   │   └── SocialShare.tsx
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── pages/            # Main page components
│   │   ├── HomePage.tsx
│   │   └── EventPage.tsx
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── countdown.ts
│   │   ├── eventStorage.ts
│   │   └── sharing.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── docs/                 # Documentation
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── vite.config.ts        # Vite configuration
└── LICENSE               # MIT License
```

## 🎨 Customization Guide

### Colors and Themes

The application uses a comprehensive color system defined in `src/components/CountdownTimer.tsx`. You can customize event type colors by modifying the `getThemeColors()` function:

```typescript
const getThemeColors = () => {
  switch (eventType) {
    case 'wedding':
      return 'from-rose-500 to-pink-600';        // Wedding theme
    case 'birthday':
      return 'from-purple-500 to-indigo-600';    // Birthday theme
    case 'product-launch':
      return 'from-green-500 to-emerald-600';    // Product launch theme
    default:
      return 'from-blue-500 to-cyan-600';        // Custom theme
  }
};
```

### Typography

Update fonts in `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Your-Font', 'system-ui', 'sans-serif'],
  mono: ['Your-Mono-Font', 'monospace'],
},
```

### Event Types

Add new event types by modifying `src/components/EventForm.tsx`:

```typescript
const eventTypes = [
  { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500' },
  { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-purple-500' },
  { value: 'product-launch', label: 'Product Launch', icon: Rocket, color: 'text-green-500' },
  { value: 'new-event', label: 'New Event', icon: Star, color: 'text-yellow-500' }, // Add new type
];
```

### Default Background Images

Update default gradients in `src/pages/EventPage.tsx`:

```typescript
const getDefaultBackground = () => {
  switch (event.eventType) {
    case 'wedding':
      return 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600';
    // Add your custom gradients here
  }
};
```

### Animation Settings

Customize animations in `tailwind.config.js`:

```javascript
animation: {
  'custom-bounce': 'customBounce 2s infinite',
  'custom-fade': 'customFade 0.5s ease-in-out',
},
keyframes: {
  customBounce: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
},
```

## 🚀 Deployment Guide

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Netlify Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or drag and drop**:
   - Go to [Netlify](https://netlify.com)
   - Drag the `dist` folder to deploy

### Static Hosting (Apache/Nginx)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload `dist` folder contents** to your web server

3. **Configure routing** (for SPA support):

   **Apache (.htaccess)**:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

   **Nginx**:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

### Environment Variables

For production deployment, you may want to set up environment variables for external services:

```bash
# .env.production
VITE_API_URL=https://your-api-url.com
VITE_ANALYTICS_ID=your-analytics-id
```

## ⚙️ Configuration Options

### Vite Configuration

Customize build settings in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### TailwindCSS Configuration

The theme uses a custom TailwindCSS configuration with:
- Dark mode support
- Custom animations
- Extended color palette
- Responsive breakpoints
- Custom font families

## 🔧 Development Tips

### Local Storage

The application uses localStorage to persist countdown events. In production, you might want to integrate with a backend service.

### Image Handling

Currently, uploaded images are stored as base64 data URLs. For production, consider:
- Cloud storage integration (AWS S3, Cloudinary)
- Image optimization and compression
- CDN distribution

### Performance Optimization

- Images are lazy-loaded where possible
- Components are optimized to prevent unnecessary re-renders
- Animations use CSS transforms for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with memory error**:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **Dark mode not working**:
   - Ensure `dark` class is added to HTML element
   - Check localStorage for theme preference

3. **Countdown not updating**:
   - Verify date format is correct
   - Check browser console for JavaScript errors

4. **Social sharing not working**:
   - Ensure HTTPS in production
   - Check popup blocker settings

### Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

For older browser support, consider adding polyfills.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 🤝 Support

For technical support or customization requests:
- Check the documentation thoroughly
- Review the code comments
- Test in a clean environment
- Document your changes for future reference

## 🔄 Updates

Keep your installation updated:

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

Remember to test thoroughly after updates, especially major version changes.