import { NavLink, useRouteLoaderData } from 'react-router-dom';

function Navigation() {
  const user = useRouteLoaderData('root');

  return (
    <nav className="flex justify-center py-4">
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            end
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/menu"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Our Menu
          </NavLink>
        </li>

        {!user ? (
          <li>
            <NavLink
              to="/login?mode=login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Login
            </NavLink>
          </li>
        ) : user.role === 'service_role' ? (
          <li>
            <NavLink
              to="/orders/edit"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Ongoing orders
            </NavLink>
          </li>
        ) : (
          <li>
            <NavLink
              to="/history"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              History
            </NavLink>
          </li>
        )}
        {user && (
          <li>
            <NavLink
              to="/community"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Community
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
