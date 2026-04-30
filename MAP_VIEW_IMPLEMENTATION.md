# Map View Implementation

## Overview
A comprehensive map view has been added to the dashboard, allowing users to view and search for activities on an interactive map with location-based filtering.

## Features Implemented

### 1. Interactive Map Component (`src/components/MapView.tsx`)
- **Leaflet Integration**: Uses React-Leaflet for map rendering
- **Custom Markers**: Color-coded pins based on activity type (travel, concert, sports, event)
- **Activity Popups**: Click on markers to see activity details in a popup
- **Responsive Design**: Fully responsive with mobile-friendly controls

### 2. Map Controls
- **City Selector**: Dropdown to quickly jump to major Swiss cities (Zurich, Geneva, Basel, Bern, Lausanne)
- **Location Search**: Search bar to find specific locations
- **Radius Filter**: Adjustable slider (1-30 km) to filter activities by distance
- **Filter Toggle**: Show/hide the radius circle on the map
- **My Location Button**: Quick return to default location

### 3. View Toggle (Home Page)
- **List/Map Toggle**: Switch between traditional list view and map view
- **Seamless Integration**: Both views use the same filtered activities
- **Persistent Filters**: Search and category filters work in both views

### 4. Visual Design
- **Dark Theme**: Matches the app's dark aesthetic
- **Glassmorphism**: Translucent controls with backdrop blur
- **Color-Coded Markers**: 
  - 🔵 Blue for Travel
  - 🟣 Purple for Concerts
  - 🟢 Green for Sports
  - 🟠 Orange for Events
- **Radius Circle**: Visual indicator of search area
- **Activity Counter**: Shows number of activities in current view

### 5. Map Styling
- **Custom Tile Layer**: Styled OpenStreetMap tiles with adjusted brightness/contrast
- **Dark Controls**: Custom-styled zoom controls matching the dark theme
- **Smooth Animations**: Framer Motion animations for control panels
- **Custom Popups**: Styled activity preview cards in map popups

## Technical Details

### Dependencies Used
- `leaflet`: Core mapping library
- `react-leaflet`: React bindings for Leaflet
- `framer-motion`: Smooth animations
- `@types/leaflet`: TypeScript definitions

### Key Components
1. **MapView Component**: Main map container with all controls
2. **MapController**: Helper component to handle map center changes
3. **Custom Markers**: SVG-based markers with activity type icons
4. **Radius Filter**: Distance-based activity filtering using Haversine formula

### Files Modified
- `src/components/MapView.tsx` (new): Main map component
- `src/pages/Home.tsx`: Added map view toggle
- `src/main.tsx`: Added Leaflet CSS import
- `src/index.css`: Added custom Leaflet styling

## Usage

### Switching to Map View
1. Navigate to the home page
2. Click the "Map" button in the view toggle (top right)
3. The map will display all filtered activities as pins

### Using Map Controls
1. **Change City**: Select from dropdown to jump to a city
2. **Search Location**: Type location name and press Enter or click search
3. **Adjust Radius**: Click filter icon, then drag the slider
4. **View Activity**: Click any pin to see details, then "View Details" to navigate

### Filtering Activities
- Use the category pills (Travel, Concerts, Sports, Events)
- Use the search bar in the hero section
- Adjust the radius filter in map view
- All filters work together seamlessly

## Future Enhancements (Optional)
- Geolocation API integration for "My Location"
- Clustering for many activities in one area
- Route planning between activities
- Save favorite locations
- Real-time activity updates on map
- Custom map themes (light/dark toggle)

## Browser Compatibility
- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome, Firefox)
- Responsive design for all screen sizes

## Performance
- Efficient marker rendering with custom SVG icons
- Optimized filtering with useMemo
- Lazy loading of map tiles
- Smooth animations without performance impact