import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";
import ReactTooltip from "react-tooltip";

const routes: {
  path?: string;
  icon?: string;
  name: string;
  admin?: boolean;
}[] = [
  {
    path: "/dashboard", // the url
    icon: "home", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/devices",
    icon: "laptop-house",
    name: "Devices",
  },
  {
    path: "/users",
    icon: "users",
    name: "Users",
    admin: true,
  },
];

export const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dark = useSelector((state: RootState) => state.app.dark);
  const { user } = useSelector((state: RootState) => state.auth);
  const { pathname } = useLocation();
  return (
    <aside className="z-30 flex-shrink-0  w-20  bg-white dark:bg-blueGray-800 relative h-screen flex flex-col  border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <Link to="/">
          <img
            src={require("../assets/images/sanctuary-logosq640.png").default}
            className="w-8 h-8"
            alt="logo"
          />
        </Link>
      </div>
      <div className="text-blueGray-800 dark:text-gray-400 flex-1 flex flex-col justify-center mb-16">
        {routes.map((v) => {
          const isActive = v.path === pathname;
          if (!v.admin || (user && user.userData.admin)) {
            return (
              <Link
                to={v.path ?? ""}
                key={v.name}
                data-tip={v.name}
                className={`relative py-4 flex items-center justify-center hover:bg-blueGray-100 dark:hover:bg-blueGray-800 hover:text-blue-600 ${
                  isActive &&
                  "bg-blueGray-100 dark:bg-blueGray-800 text-blue-900 dark:text-white"
                } font-medium transition cursor-pointer `}
              >
                {v.icon && (
                  <div
                    className={`w-10 h-10 flex items-center justify-center ${
                      isActive ? "bg-blue-600" : "bg-lightBlue-100"
                    }  rounded`}
                  >
                    <i
                      className={`fas fa-${v.icon} text-lg  ${
                        isActive ? "text-white" : "text-lightBlue-500"
                      }`}
                    />
                  </div>
                )}
                {isActive && (
                  <div className="h-full absolute inset-y-0 left-0 flex items-center">
                    <div className="rounded-tr-md rounded-br-md bg-blue-600 dark:bg-blue-400 w-1 h-3/5" />
                  </div>
                )}
              </Link>
            );
          } else {
            return null;
          }
        })}
      </div>
      <ReactTooltip place="right" effect="solid" />
    </aside>
  );
};

export default Sidebar;
