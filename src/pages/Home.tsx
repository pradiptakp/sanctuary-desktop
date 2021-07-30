/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../components/Card';
import { RootState } from '../redux/store';
import { getDashboardInfo } from '../redux/actions/appActions';
import { DashboardData } from '../types';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { hostUrl } = useSelector((state: RootState) => state.app);

  React.useEffect(() => {}, []);

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <Card className="bg-gradient-to-tr from-purple-200 to-blue-100 col-span-2 py-8 flex items-center shadow-none">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-lg font-bold">
              Hello, {user?.userData.username}
            </div>
            <div className="">What would you like to do?</div>
          </div>
          <div></div>
        </Card>
        <Link to="/setup">
          <Card className="flex items-center hover:bg-blueGray-50 transition">
            <div className="flex-1">
              <div className="text-xl font-bold">Setup Device</div>
            </div>
          </Card>
        </Link>
        <Link to="/input-host">
          <Card className="flex items-center hover:bg-blueGray-50 transition">
            <div className="flex-1">
              <div className="text-xl font-bold">Change Hostname</div>
              <div className="font-bold text-gray-600">
                Current Hostname :{' '}
                <span className="font-normal">{hostUrl}</span>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Home;
