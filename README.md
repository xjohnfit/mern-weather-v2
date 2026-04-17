# Weather Forecast App

A modern, responsive weather application built with React, Vite, and Tailwind CSS. Features real-time weather data, 5-day forecasts, and intelligent city search with autocomplete.

## Features

- **Real-time Weather Data** - Current temperature, humidity, wind speed, and conditions
- **5-Day Forecast** - Detailed weather predictions with 3-hour intervals
- **Smart City Search** - Autocomplete suggestions powered by OpenStreetMap Nominatim
- **Modern UI** - Beautiful gradient backgrounds with glassmorphism effects
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Weather Icons** - Dynamic icons based on weather conditions
- **Popular Cities** - Quick access to frequently searched locations

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **HTTP Client:** Axios
- **Weather API:** RapidAPI (open-weather13)
- **Geocoding:** OpenStreetMap Nominatim
- **State Management:** React Context API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- RapidAPI account (for weather data)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-weather-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_rapidapi_key_here
   ```

   To get your API key:
   - Sign up at [RapidAPI](https://rapidapi.com/)
   - Subscribe to the [Open Weather13 API](https://rapidapi.com/worldapi/api/open-weather13)
   - Copy your API key to the `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5001`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
mern-weather-v2/
├── src/
│   ├── components/
│   │   ├── WeatherCard.jsx    # Main weather display card
│   │   ├── MiniCard.jsx        # Forecast card for hourly data
│   │   └── index.jsx           # Component exports
│   ├── Context/
│   │   └── index.jsx           # Context API for state management
│   ├── Utils/
│   │   └── useDate.jsx         # Custom hook for date/time
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles with Tailwind
├── public/                     # Static assets
├── kubernetes/                 # Kubernetes deployment configs
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Nginx configuration for production
└── tailwind.config.js         # Tailwind CSS configuration
```

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build --build-arg VITE_API_KEY=your_api_key -t weather-app .

# Run the container
docker run -p 8080:8080 weather-app
```

Access the app at `http://localhost:8080`

## Kubernetes Deployment

For detailed Kubernetes deployment instructions, see [KUBERNETES-DEPLOYMENT-GUIDE.md](KUBERNETES-DEPLOYMENT-GUIDE.md)

Quick deployment:
```bash
kubectl apply -f kubernetes/
```

## Features in Detail

### City Search with Autocomplete
- Type 2+ characters to see suggestions
- Combines popular cities with OpenStreetMap results
- Click any suggestion to fetch weather data
- Supports cities worldwide

### Weather Display
- Current temperature with "feels like" indicator
- Weather condition with dynamic icon
- Wind speed in mph
- Humidity percentage
- 5-day forecast with 3-hour intervals

### Popular Cities
Pre-configured coordinates for fast lookup:
- Long Island City (default)
- New York, Boston, Los Angeles
- Chicago, Miami, Seattle
- San Francisco, Houston, Phoenix
- Philadelphia, San Diego, Dallas
- Austin, Las Vegas

## API Integration

### Weather Data
- **Provider:** RapidAPI - Open Weather13
- **Endpoint:** `/fivedaysforcast`
- **Features:** Temperature, humidity, wind speed, pressure, conditions

### Geocoding
- **Provider:** OpenStreetMap Nominatim
- **Free:** No API key required
- **Rate Limit:** 1 request per second (handled automatically)

## Configuration

### Vite Config
- Development server runs on port 5001
- Fast refresh enabled
- Environment variables prefixed with `VITE_`

### Tailwind CSS
- Configured with default theme
- Scans all JSX/TSX files for classes
- PostCSS integration included

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data from [RapidAPI](https://rapidapi.com/)
- Geocoding from [OpenStreetMap](https://www.openstreetmap.org/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
