import { Link } from 'react-router-dom';
import SearchOrder from '../Features/Order/SearchOrder';
import Username from '../Features/authentication/Username';
import { useState } from 'react';
import Navigation from './Navigation/Navigation';

function Header() {
  return (
    <div className="h-25 border-b-4 border-dashed border-amber-400 bg-lime-300 px-4 py-3 font-bold sm:px-7 md:h-auto md:text-lg">
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          {' '}
          <div className="mb-1">
            <Link className="text-xl text-cyan-600 md:text-4xl" to="/">
              Xenios taverna
            </Link>
          </div>
          <SearchOrder />
        </div>
        <Username />
      </header>
      <Navigation />
    </div>
  );
}

export default Header;
