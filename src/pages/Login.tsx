import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { postLogin } from '../redux/actions/authActions';
import nProgress from 'nprogress';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const onLogin = () => {
    nProgress.start();
    setLoading(true);
    dispatch(
      postLogin.request({
        data: {
          password,
          username,
        },
        onSuccess: () => {
          nProgress.done();
          setLoading(false);
          history.replace('/dashboard');
        },
        onFailure: () => {
          setLoading(false);
          nProgress.done();
          toast.error('Login failed');
        },
      })
    );
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                onLogin();
              }}
            >
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <div className="block text-gray-700 dark:text-gray-400">
                <span>Email</span>
                <Input
                  type="email"
                  placeholder="john@doe.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mt-4 block text-gray-700 dark:text-gray-400">
                <span>Password</span>
                <Input
                  type="password"
                  placeholder="*****"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                className="mt-6"
                disabled={loading || !username || !password}
              >
                Log in
              </Button>
            </form>
          </main>
          <div className="h-32 md:h-auto md:w-1/2 bg-purple-900 flex items-center justify-center">
            <img
              src={
                require('../assets/images/sanctuary-logo-white640.png').default
              }
              alt="logo"
              className="h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
