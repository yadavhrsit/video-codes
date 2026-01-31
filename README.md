# Tech Concepts - Interactive Learning Hub

A beautiful, interactive platform for demonstrating and teaching tech topics. Perfect for creating engaging content for YouTube Shorts, Instagram Reels, and educational videos.

## 🚀 Features

- **Beautiful Landing Page** - Modern, animated menu with gradient effects and smooth transitions
- **Dedicated Topic Pages** - Each concept gets its own focused page
- **Easy Navigation** - Simple back button to return to the home menu
- **Scalable Architecture** - Add new topics in minutes
- **Responsive Design** - Works perfectly on all screen sizes

## 🎨 Current Topics

1. **State in React** - Interactive counter demonstrating React state management
2. **useEffect Hook** - Window resize detector showing side effects and lifecycle

## 📝 How to Add New Topics

Adding a new topic is super easy! Follow these steps:

### Step 1: Create Your Demo Component

Create a new file in `src/demos/` (e.g., `YourTopicDemo.jsx`):

```jsx
import { useState } from 'react';

function YourTopicDemo({ onBack }) {
    return (
        <div className="demo-page">
            <div className="demo-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Home
                </button>
                <h1 className="demo-title">Your Topic Title</h1>
            </div>

            <div className="demo-content">
                <div className="card">
                    {/* Your interactive demo here */}
                    <h3>Your Demo Content</h3>
                </div>

                <div className="code-snippet">
                    <pre>
                        {`// Your code example here
const example = "code";`}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default YourTopicDemo;
```

### Step 2: Add to Landing Page

Open `src/pages/LandingPage.jsx` and add your topic to the `topics` array:

```jsx
const topics = [
    // ... existing topics
    {
        id: 'your-topic',  // Unique ID for routing
        title: 'Your Topic Title',
        description: 'Brief description of what this topic covers',
        icon: '🎯',  // Choose an emoji icon
        color: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',  // Custom gradient
        category: 'Category Name'
    },
];
```

### Step 3: Register in App Router

Open `src/App.jsx` and:

1. Import your component:
```jsx
import YourTopicDemo from './demos/YourTopicDemo';
```

2. Add a case in the `renderPage()` switch statement:
```jsx
case 'your-topic':
    return <YourTopicDemo onBack={() => navigateToPage('home')} />;
```

That's it! Your new topic is now live! 🎉

## 🎨 Customization Tips

### Color Gradients
Use these beautiful gradient combinations for your topic cards:

- Purple: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Pink: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- Blue: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- Orange: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`
- Green: `linear-gradient(135deg, #30cfd0 0%, #330867 100%)`

### Icons
Choose from any emoji or use icon libraries like:
- ⚡ Lightning (Performance)
- 🔄 Arrows (Lifecycle)
- 🎯 Target (Focus/Goals)
- 🚀 Rocket (Launch/Deploy)
- 💡 Bulb (Ideas/Concepts)
- 🎨 Palette (Design)
- 🔧 Wrench (Tools)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── App.jsx              # Main app with routing logic
├── App.css              # App-level styles
├── index.css            # Global styles
├── main.jsx             # Entry point
├── pages/
│   ├── LandingPage.jsx  # Home page with topic menu
│   └── LandingPage.css  # Landing page styles
└── demos/
    ├── StateDemo.jsx    # State demonstration
    ├── EffectDemo.jsx   # useEffect demonstration
    └── ...              # Add your demos here
```

## 🎥 Perfect for Content Creation

This platform is designed to create engaging, visual demonstrations for:
- YouTube Shorts
- Instagram Reels
- TikTok videos
- Educational tutorials
- Live coding sessions

## 💡 Ideas for Future Topics

- **Props & Component Communication**
- **Context API**
- **Custom Hooks**
- **React Router**
- **Form Handling**
- **API Integration**
- **Performance Optimization**
- **TypeScript with React**
- **Testing Components**
- **State Management (Redux/Zustand)**

---

**Made with ❤️ for teaching and learning**
