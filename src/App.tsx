import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import './custompanel.css';
import ErrorPage from './pages/ErrorPage';
import LoginRegister from './pages/LoginRegisterPage';
import RootLayout from './pages/RootPage';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/Path/PrivateRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'));
const AllUserPage = lazy(() => import('./pages/AllUserPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyFlatsPage = lazy(() => import('./pages/MyFlatsPage'));
const NewFlatPage = lazy(() => import('./pages/NewFlatPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const UpdateProfilePage = lazy(() => import('./pages/UpdateProfilePage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div>
            <i className="pi pi-spin pi-spinner"></i> Loading...
          </div>
        }
      >
        <LoginRegister />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: (
          <Suspense
            fallback={
              <div>
                <i className="pi pi-spin pi-spinner"></i> Loading...
              </div>
            }
          >
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense
            fallback={
              <div>
                <i className="pi pi-spin pi-spinner"></i> Loading...
              </div>
            }
          >
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/home/',
    element: (
      <Suspense
        fallback={
          <div>
            <i className="pi pi-spin pi-spinner"></i> Loading...
          </div>
        }
      >
        <RootLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <PrivateRoute>
            <FavouritesPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'all-users',
        element: (
          <PrivateRoute>
            <AllUserPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-flats',
        element: (
          <PrivateRoute>
            <MyFlatsPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'new-flat',
        element: (
          <PrivateRoute>
            <NewFlatPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'update-profile',
        element: (
          <PrivateRoute>
            <UpdateProfilePage />
          </PrivateRoute>
        ),
      },
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
