# GroupSave - Swiss Group Activity Platform

A modern, interactive web application for creating and joining group activities to save money on group tickets in Switzerland.

## 🎯 Features

- **Browse Activities**: Discover group activities across Switzerland
- **Real-time Updates**: See live spot availability and new activities
- **Interactive Filters**: Filter by city, type, date, and search
- **Create Activities**: Post your own group activities
- **Join Activities**: Request to join existing activities
- **Comments**: Coordinate with other participants
- **Notifications**: Get notified about activity updates
- **Interactive Maps**: Visual location display with Leaflet
- **Countdown Timers**: Live countdown to activity start
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Maps**: Leaflet + React Leaflet
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
group-activity-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ActivityCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Navbar.tsx
│   │   ├── SpotProgress.tsx
│   │   ├── CountdownTimer.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── ActivityDetail.tsx
│   │   ├── CreateActivity.tsx
│   │   └── Profile.tsx
│   ├── store/              # Zustand stores
│   │   ├── activityStore.ts
│   │   ├── userStore.ts
│   │   └── notificationStore.ts
│   ├── data/               # Mock data
│   │   ├── mockActivities.ts
│   │   ├── mockUsers.ts
│   │   └── swissCities.ts
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   └── demoSimulator.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Design Principles

### Code Quality
- **TypeScript**: Strict typing for better code quality
- **ESLint**: Code linting and formatting
- **Component-based**: Reusable, modular components
- **Separation of Concerns**: Clear separation between UI, logic, and data

### Best Practices
- **Immutable State**: Using Zustand with immutable updates
- **Pure Functions**: Utility functions are pure and testable
- **Proper Typing**: Comprehensive TypeScript interfaces
- **Error Handling**: Graceful error handling throughout
- **Performance**: Optimized re-renders and lazy loading
- **Accessibility**: Semantic HTML and ARIA labels

### User Experience
- **Responsive**: Mobile-first design
- **Interactive**: Smooth animations and transitions
- **Intuitive**: Clear navigation and user flows
- **Fast**: Optimized performance
- **Engaging**: Real-time updates and notifications

## 🚀 Demo Features

### Mock Data
The app uses realistic Swiss data:
- Real Swiss cities with coordinates
- Authentic activity types (SBB travel, concerts, sports)
- Realistic pricing in CHF
- Swiss phone number formats

### Demo Simulator
Automatic simulation of:
- Users joining activities (every 45 seconds)
- New activities being created (every 2.5 minutes)
- Real-time notifications
- Activity status updates

## 📱 Key Components

### ActivityCard
Displays activity information with:
- Activity type icon
- Title and description
- Location and date
- Price and savings
- Spot availability progress
- Status badges

### FilterBar
Interactive filtering with:
- City dropdown
- Activity type selector
- Date picker
- Search input
- Real-time results

### SpotProgress
Visual progress bar showing:
- Current vs total spots
- Animated filling
- Status indicators (filling fast, almost full)
- Color-coded states

### CountdownTimer
Live countdown displaying:
- Days, hours, minutes, seconds
- Animated updates
- Completion handling

## 🎯 Usage

### Browsing Activities
1. Open the app
2. Use filters to find activities
3. Click on an activity to see details

### Creating an Activity
1. Click "Create Activity" button
2. Fill in the form
3. Select location on map
4. Submit

### Joining an Activity
1. View activity details
2. Click "Join Activity"
3. See updated spot count
4. Add comments to coordinate

## 🔧 Configuration

### Environment Variables
Create a `.env` file (optional for demo):
```env
VITE_APP_TITLE=GroupSave
VITE_DEMO_MODE=true
```

### Customization
- **Colors**: Edit `tailwind.config.js`
- **Mock Data**: Edit files in `src/data/`
- **Simulator Timing**: Edit `src/utils/demoSimulator.ts`

## 📊 State Management

### Activity Store
- Manages all activities
- Handles filtering and sorting
- CRUD operations
- Comment management

### User Store
- Current user state
- Profile management
- Persisted to localStorage

### Notification Store
- In-app notifications
- Read/unread tracking
- Auto-cleanup

## 🎨 Styling

### Tailwind CSS
- Utility-first approach
- Custom color palette
- Responsive breakpoints
- Custom animations

### Framer Motion
- Page transitions
- Component animations
- Gesture handling
- Layout animations

## 🗺️ Maps Integration

### Leaflet
- Interactive maps
- Location markers
- Custom styling
- Click-to-select location

## 📝 TypeScript

### Type Safety
- Strict mode enabled
- Comprehensive interfaces
- Type inference
- Generic types

### Best Practices
- No `any` types
- Proper null handling
- Union types for states
- Utility types

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist folder to Vercel
```

### GitHub Pages
```bash
npm run build
# Deploy dist folder to gh-pages branch
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

## 🤝 Contributing

This is a demo/hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for your projects!

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Framer Motion](https://www.framer.com/motion/)

## 🐛 Known Issues

- TypeScript errors will appear until dependencies are installed
- Run `npm install` to resolve all import errors
- Demo simulator runs automatically (can be disabled in code)

## 💡 Tips for Hackathon Demo

1. **Start with filters**: Show how easy it is to find activities
2. **Create an activity**: Demonstrate the form and map picker
3. **Join an activity**: Show real-time spot updates
4. **Add comments**: Demonstrate coordination features
5. **Show notifications**: Highlight the notification system
6. **Emphasize savings**: Point out the group discount benefits

## 🎉 Credits

Built with ❤️ for Swiss group activity enthusiasts!

---

**Note**: This is a frontend-only demo using mock data. For production, integrate with a real backend API.