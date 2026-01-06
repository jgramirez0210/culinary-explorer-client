# Culinary Explorer

A modern web application for logging and tracking food experiences. Users can record their culinary adventures, explore restaurants and dishes, and visualize locations on an interactive map.

## Features

- **Food Logging**: Track meals with detailed information about dishes, restaurants, and personal ratings
- **Restaurant Management**: Add and manage restaurant information with location data
- **Dish Catalog**: Maintain a collection of dishes with categories and descriptions
- **Interactive Maps**: Visualize restaurant locations using Google Maps integration
- **Search Functionality**: Find food logs by dish name, restaurant, or category
- **User Authentication**: Secure Google OAuth login via Firebase
- **Responsive Design**: Mobile-friendly interface built with Bootstrap

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with server-side rendering
- **React 18** - User interface library
- **Node.js** - Runtime environment

### Authentication
- **Firebase 11.1.0** - Authentication service
- **Google OAuth** - Social login provider

### Mapping & Location
- **Google Maps JavaScript API** - Interactive maps
- **@react-google-maps/api** - React Google Maps integration
- **react-google-places-autocomplete** - Location autocomplete

### UI & Styling
- **Bootstrap 5.1.3** - CSS framework
- **React Bootstrap 2.4.0** - Bootstrap components for React
- **react-hover** - Hover effects

### HTTP & Data
- **Axios 1.7.7** - HTTP client
- **Fetch API** - Native browser HTTP requests

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **TypeScript 5.7.3** - Type checking

### Backend
- **Django REST Framework** - API server
- **Python** - Backend runtime
- **Pipenv** - Python dependency management

## Project Structure

```
culinary-explorer-client/
├── api/                    # API client functions
│   ├── Categories.js      # Category management
│   ├── Dish.js           # Dish CRUD operations
│   ├── FoodLog.js        # Food log operations
│   └── Restaurants.js    # Restaurant management
├── components/            # Reusable React components
│   ├── forms/            # Form components
│   ├── hover cards/      # Interactive cards
│   └── ...               # UI components
├── pages/                 # Next.js pages
│   ├── _app.js           # App wrapper
│   ├── index.js          # Home/dashboard
│   ├── search.js         # Search page
│   └── food_log/         # Food log pages
├── utils/                 # Utility functions
│   ├── auth.js           # Firebase auth
│   ├── context/          # React context
│   └── ...               # Map utilities
├── styles/                # Global styles
├── assets/                # Static assets
└── public/                # Public files
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Google authentication enabled
- Google Maps API key
- Django backend server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd culinary-explorer-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_DATABASE_URL=https://your-django-backend-url.com
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Set up pre-commit hooks**
   ```bash
   npm run prepare
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication
- Click "Sign In" to authenticate with Google
- The app will automatically check user registration with the backend

### Logging Food
- From the dashboard, view your existing food logs
- Use the navigation to create new food logs
- Fill in details about the dish, restaurant, and your experience

### Managing Restaurants
- Add new restaurants with location information
- View restaurants on the interactive map
- Edit or delete restaurant entries

### Searching
- Use the search page to find food logs
- Search by dish name, restaurant, or category

## API Integration

The frontend communicates with a Django backend via REST API endpoints:

- `GET/POST /food_log` - Food log CRUD
- `GET/POST /restaurants` - Restaurant management
- `GET/POST /dish` - Dish operations
- `GET /categories` - Category list
- `POST /checkuser` - User verification
- `POST /register` - User registration

Configure the backend URL in `NEXT_PUBLIC_DATABASE_URL`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prepare` - Set up Husky hooks

### Code Quality

The project uses:
- **ESLint** with Airbnb configuration for code linting
- **Prettier** for consistent code formatting
- **Husky** for pre-commit hooks
- **lint-staged** to run linters on staged files

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

The app is configured for deployment on platforms like Netlify or Vercel.

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_DATABASE_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Firebase Authentication Error**
- Verify Firebase credentials in `.env.local`
- Ensure Google OAuth is enabled in Firebase console
- Check Firebase project configuration

**Google Maps Not Loading**
- Confirm Google Maps API key is valid
- Enable required APIs in Google Cloud Console
- Check API key restrictions

**Backend Connection Failed**
- Ensure Django backend is running
- Verify `NEXT_PUBLIC_DATABASE_URL` is correct
- Check CORS settings on backend

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)