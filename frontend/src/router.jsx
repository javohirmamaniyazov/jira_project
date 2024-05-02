import { createBrowserRouter } from 'react-router-dom';
import Login from './AuthPages/login.jsx';
import Register from './AuthPages/register.jsx';
import DefaultLayout from './Components/DefaultLayout.jsx';
import GuestLayout from './Components/GuestLayout.jsx';
import WeeksPage from './views/Weeks/WeeksPage.jsx';
import MonthLayout from './Components/MonthLayout.jsx';
import WeekLayout from './Components/WeekLayout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
  },

  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/weeks',
    element: <WeekLayout />,
  },
  {
    path: '/months',
    element: <MonthLayout />, 
  },
]);

export default router;
