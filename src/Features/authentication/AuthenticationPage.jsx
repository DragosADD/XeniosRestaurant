import { json, redirect } from 'react-router-dom';
import AuthForm from './AuthForm';
import { login, signup } from '../../Services/apiAuth';

export default function AuthenticationPage() {
  return <AuthForm></AuthForm>;
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';
  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Unsupported mode' }, { status: 422 });
  }
  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
    name: data.get('name'),
    phone: data.get('tel'),
    address: data.get('address'),
  };
  let response;
  if (mode === 'signup') response = await signup(authData);

  if (mode === 'login') response = await login(authData);

  console.log(response);

  return redirect('/');
}
