import { Outlet, useNavigation, useRouteLoaderData } from 'react-router-dom';
import CartOverview from '../Features/Cart/CartOverview';
import Header from './Header';
import Loader from './Loader';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const user = useRouteLoaderData('root');

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl ">
          <Outlet />
        </main>
      </div>
      {user?.role !== 'service_role' && <CartOverview />}
    </div>
  );
}

export default AppLayout;
