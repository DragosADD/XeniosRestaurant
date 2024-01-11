import Button from '../../UI/button/Button';
import { Form, useSearchParams, useNavigation } from 'react-router-dom';

function AuthForm() {
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <>
      <div className=" ml-2 flex flex-col items-center justify-center font-medium text-cyan-950">
        <Form method="post">
          <h2 className=" mb-8 mt-5 text-xl font-semibold">
            {isLogin ? 'Log in' : 'Create a new user'}
          </h2>
          {!isLogin && (
            <div className="my-2 flex flex-col">
              <label>Full Name</label>
              <input id="name" type="name" name="name" required />
            </div>
          )}
          <div className="my-2 flex flex-col">
            <label>Email Address</label>
            <input id="email" type="email" name="email" required />
          </div>

          {!isLogin && (
            <div className="my-2 flex flex-col">
              <label>Phone number</label>
              <input id="tel" type="tel" name="tel" required />
            </div>
          )}
          {!isLogin && (
            <div className="my-2 flex flex-col">
              <label>Address, make sure that it is written correctly</label>
              <input id="address" type="address" name="address" required />
            </div>
          )}
          <div className="my-2 flex flex-col">
            <label>Password</label>
            <input id="password" type="password" name="password" required />
          </div>
          <Button
            type="clearButton"
            to={`?mode=${isLogin ? 'signup' : 'login'}`}
          >
            {isLogin
              ? `Don't have an account? Create new user here.`
              : 'Already have an account? Log in here!'}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save'}
          </Button>
        </Form>
      </div>
    </>
  );
}

export default AuthForm;
