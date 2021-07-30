import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { postLogin } from '../redux/actions/authActions';
import nProgress from 'nprogress';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { setHostUrl } from '../redux/actions/appActions';
import { RootState } from '../redux/store';

const Save = () => {
  const history = useHistory();
  const { user } = useSelector((state: RootState) => state.auth);
  const [host, setHost] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const onSave = () => {
    nProgress.start();
    setLoading(true);
    dispatch(setHostUrl(host));
    if (user) {
      history.replace('/dashboard');
      nProgress.done();
    } else {
      nProgress.done();
      history.replace('/login');
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-blueGray-100">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                onSave();
              }}
            >
              {!user ? (
                <div
                  className="text-blue-600 hover:text-blue-700 transition font-bold text-xs cursor-pointer"
                  onClick={() => history.goBack()}
                >
                  Back
                </div>
              ) : null}
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Input Hostname
              </h1>
              <div className="block text-gray-700 dark:text-gray-400">
                <span>Host URL</span>
                <Input
                  type="text"
                  placeholder="e.g, http://192.168.1.5:3002"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                />

                <div className="mt-2">Example</div>
                <div className="text-xs text-gray-400">
                  http://localhost:3002
                </div>
                <div className="text-xs text-gray-400">
                  http://192.168.1.5:3002
                </div>
                <div className="text-xs text-gray-400">
                  https://smarthome.sh/api
                </div>
              </div>

              <Button className="mt-6" disabled={loading || !host}>
                Save
              </Button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Save;
