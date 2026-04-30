# meetup. - Event Discovery Platform

A fully interactive single-page web application for discovering and creating spontaneous events in Zurich, targeting young people under 30.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

## ✨ Features

### Core Functionality
- **Real-time Event Management**: Create, join, and leave events with instant updates
- **Interactive Map**: Leaflet.js integration with custom markers showing events across Zurich
- **Smart Filtering**: Category-based filtering that syncs across list and map views
- **Live Updates**: Join counts, profile stats, and event states update in real-time
- **Toast Notifications**: User-friendly feedback for all actions
- **New Event Badges**: Newly created events get a green "new" badge with pop-in animation

### Pages & Routes
1. **`/` - Discover**: Event feed with category filter and list/map toggle
2. **`/create` - Create Event**: Form with validation for creating new events
3. **`/profile` - Profile**: User stats, joined events, and organized events

### Design Highlights
- **Fully Responsive**: Mobile-first design with bottom navigation on mobile, sidebar on desktop
- **Custom Fonts**: Syne (headings, 800 weight) + DM Sans (body) via Google Fonts
- **Color Palette**: 
  - Primary: `#0EA5E9` (Sky Blue)
  - Accent: `#6366F1` (Indigo)
  - Dark: `#0F172A` (Slate)
  - Background: `#F0F4FF` (Light Blue)
- **Smooth Animations**: Card hover effects, modal slide-ups, toast notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. **Clone or navigate to the project directory**
```bash
cd event-discovery-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
event-discovery-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── EventCard.tsx    # Event card with hover effects
│   │   ├── EventModal.tsx   # Modal for event details
│   │   ├── MapView.tsx      # Leaflet map with custom markers
│   │   ├── CategoryFilter.tsx # Category selection
│   │   ├── BottomNav.tsx    # Mobile bottom navigation
│   │   ├── Sidebar.tsx      # Desktop sidebar
│   │   └── Toast.tsx        # Toast notifications
│   ├── pages/               # Page components
│   │   ├── Discover.tsx     # Main discovery page
│   │   ├── CreateEvent.tsx  # Event creation form
│   │   └── Profile.tsx      # User profile
│   ├── store/
│   │   └── eventStore.ts    # Zustand state management
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── data/
│   │   └── mockEvents.ts    # Pre-populated mock data
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + Tailwind
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🎯 Key Technologies

### Frontend Framework
- **React 18.2**: Modern React with hooks
- **TypeScript 5.3**: Type-safe development
- **Vite 5.0**: Lightning-fast dev server with HMR

### State Management
- **Zustand 4.4**: Lightweight state management (simpler than Redux)

### Routing
- **React Router 6.20**: Client-side routing

### Styling
- **Tailwind CSS 3.3**: Utility-first CSS framework
- **Custom Animations**: Smooth transitions and effects

### Maps
- **Leaflet 1.9.4**: Interactive maps
- **React-Leaflet 4.2**: React wrapper for Leaflet

## 🎨 Design System

### Colors
```css
Primary:    #0EA5E9  /* Sky Blue - main actions */
Accent:     #6366F1  /* Indigo - highlights */
Dark:       #0F172A  /* Slate - text/backgrounds */
Background: #F0F4FF  /* Light Blue - page background */
Success:    #10B981  /* Green - success states */
Warning:    #F59E0B  /* Amber - warnings */
Danger:     #DC2626  /* Red - errors/full events */
```

### Typography
- **Headings**: Syne (800 weight)
- **Body**: DM Sans (400 weight)
- **Small text**: DM Sans (300 weight)

### Spacing
- 4px grid system (Tailwind default)

## 🔧 State Management

The app uses Zustand for state management with the following structure:

```typescript
{
  events: Event[]              // All events
  joinedIds: number[]          // IDs of events user joined
  myEventIds: number[]         // IDs of events user created
  activeCat: string            // Active category filter
  activeView: 'list' | 'map'   // Current view mode
  toastMessage: string         // Toast notification message
  showToast: boolean           // Toast visibility
  
  // Actions
  addEvent()                   // Create new event
  toggleJoin()                 // Join/leave event
  setCategory()                // Change category filter
  setView()                    // Toggle list/map view
  getFilteredEvents()          // Get filtered events
  displayToast()               // Show toast notification
}
```

## 📱 Responsive Design

### Mobile (< 768px)
- Bottom navigation bar
- Horizontal scrollable category pills
- Full-page event modal
- Single column event grid

### Desktop (≥ 768px)
- Left sidebar with categories
- Top navigation bar
- Modal overlay for event details
- Multi-column event grid (2-3 columns)

## 🎭 Interactive Features

### Real-time Updates
- ✅ Creating an event adds it to feed and map instantly
- ✅ Joining increments count everywhere it's displayed
- ✅ Leaving decrements count
- ✅ Full events disable join button
- ✅ Profile stats update automatically
- ✅ Category filter works on both list and map views

### Animations
- ✅ Card hover: lift effect with shadow
- ✅ Modal: slide up from bottom
- ✅ New events: pop-in animation with green badge
- ✅ Toast: fade in/out

## 🗺️ Mock Data

The app comes with 6 pre-populated events across Zurich:

1. **Uetliberg Sunrise Hike** (Hiking)
2. **Lake Zurich Morning Run** (Running)
3. **Altstadt Food Tour** (Cooking)
4. **Friday Rooftop Party** (Party)
5. **Cycling to Rapperswil** (Cycling)
6. **Climbing Session** (Climbing)

All events have realistic Zurich locations with accurate lat/lng coordinates.

## 🧪 Testing the App

### Manual Testing Checklist
- [ ] Create a new event → appears in feed and map
- [ ] Join an event → count increments
- [ ] Leave an event → count decrements
- [ ] Fill event to max → join button disabled
- [ ] Filter by category → both views update
- [ ] Toggle list/map view → data persists
- [ ] Check profile stats → counts are correct
- [ ] Toast notifications → appear for actions
- [ ] New event badge → shows for 10 seconds
- [ ] Responsive design → works on mobile and desktop

## 🚧 Future Enhancements

- [ ] Backend integration with real database
- [ ] User authentication
- [ ] Real-time chat for events
- [ ] Push notifications
- [ ] Event photos upload
- [ ] User reviews and ratings
- [ ] Advanced search and filters
- [ ] Calendar integration
- [ ] Social sharing

## 📄 License

This project is open source and available under the MIT License.

## 👥 Credits

Built with ❤️ for young people in Zurich who love spontaneous adventures.

---

**Happy event discovering! 🎉**