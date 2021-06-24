import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { RootState } from '../redux/store';
import { connect, useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/actions/appActions';
import { PayloadAction } from 'typesafe-actions';
import { useLocation } from 'react-router-dom';
import { toTitleCase } from '../utils/formatter';
import { postLogout } from '../redux/actions/authActions';

export const Navbar = ({
  dark,
  toggleDarkMode,
}: {
  dark?: boolean;
  toggleDarkMode: (dark: boolean) => PayloadAction<'TOGGLE_DARK_MODE', boolean>;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const onLogout = () => {
    dispatch(postLogout());
  };

  return (
    <div>
      <header className="z-50 bg-white dark:bg-blueGray-800 h-16 py-4 fixed right-8 top-4 rounded-lg shadow-lg ">
        <nav className="container flex items-center justify-between h-full px-8 ">
          <div className="flex flex-1 space-x-10 ">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="cursor-pointer flex space-x-4 items-center focus:outline-none ">
                    <img
                      src={`https://avatars.dicebear.com/api/jdenticon/${user?.userData.email}.svg`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-medium text-blueGray-800 dark:text-blueGray-100">
                        {user?.userData.username}
                      </div>
                      <div className="text-blueGray-400 text-xs mt-0.5">
                        {user?.userData.admin ? 'Admin' : 'User'}
                      </div>
                    </div>
                    <i
                      className={`fas fa-chevron-down text-blueGray-800 dark:text-blueGray-100 text-xs transition duration-200 transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200 transform"
                    enterFrom="opacity-0 translate-y-12"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150 transform"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-12"
                  >
                    <Popover.Panel className="absolute right-0 z-10 px-4 mt-2 sm:px-0 w-32">
                      <>
                        <i className="absolute right-12 fas fa-caret-up text-4xl text-white dark:text-blueGray-900" />
                        <div
                          className="overflow-hidden shadow-lg rounded-lg mt-6 bg-white dark:bg-blueGray-900 flex flex-col dark:text-blueGray-100 "
                          style={{ maxHeight: '500px' }}
                        >
                          <div
                            onClick={() => {
                              onLogout();
                            }}
                            className="p-4 relative cursor-pointer hover:bg-blue-100 dark:hover:bg-blueGray-800 hover:text-blue-800 dark:hover:text-blue-400 transition ease-in-out duration-200 "
                          >
                            Log Out
                          </div>
                        </div>
                      </>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            {/* <button
              onClick={() => {
                toggleDarkMode(!dark);
              }}
              className="focus:outline-none"
            >
              {dark ? (
                <i className="fas fa-sun text-lg text-yellow-200" />
              ) : (
                <i className="fas fa-moon text-lg text-lightBlue-800" />
              )}
            </button> */}
          </div>
        </nav>
      </header>
      <div className="mb-6">
        <div className="mb-2 text-gray-400 font-medium">
          Sanctuary
          {pathname.split('/').map((v, i) => {
            if (i === 0) return null;
            return (
              <span>
                <span className="mx-2">\</span>
                <span
                  className={`${
                    (pathname
                      .split('/')
                      [pathname.split('/').length - 2].includes('edit') &&
                      i === pathname.split('/').length - 2) ||
                    i === pathname.split('/').length - 1
                      ? 'text-blue-500 font-bold'
                      : ''
                  }`}
                >
                  {v
                    .split('-')
                    .map(
                      (_v, i) =>
                        `${i !== 0 ? ' ' : ''}${_v
                          .charAt(0)
                          .toUpperCase()}${_v.substr(1)}`
                    )}
                </span>
              </span>
            );
          })}
        </div>
        <div className="text-2xl font-bold tracking-wide">
          {toTitleCase(
            pathname.split('/')[pathname.split('/').length - 2].includes('edit')
              ? pathname
                  .split('/')
                  [pathname.split('/').length - 2].replaceAll('-', ' ')
              : pathname
                  .split('/')
                  [pathname.split('/').length - 1].replaceAll('-', ' ')
          )}
        </div>
      </div>
      {/* <div className="border-t dark:border-blueGray-800 bg-white dark:bg-blueGray-900 py-3 px-6">
        <nav
          aria-label="breadcrumb"
          className="text-xs font-bold text-blueGray-400 mb-1"
        >
          <ol className="list-reset flex">
            <li className="">Home</li>
            <li className="mx-2 ">/</li>
            <li className="">Library</li>
            <li className="mx-2 ">/</li>
            <li className="text-blueGray-600">Data</li>
          </ol>
        </nav>
        <div className="text-lg font-medium dark:text-white">Dashboard</div>
      </div> */}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  dark: state.app.dark,
});

const mapDispatchToProps = {
  toggleDarkMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
