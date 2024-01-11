import { redirect } from 'react-router-dom';
import supabase from '../Services/supabase';

export async function getUser() {
  const { data: token } = await supabase.auth.getSession();
  if (!token.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  if (data?.user) {
    return data?.user;
  } else {
    return null;
  }
}

export async function sessionLoader() {
  return await supabase.auth.getSession();
}

export async function checkAuthLoader() {
  const session = await sessionLoader();

  if (!session.data.session) {
    return redirect('/login');
  } else {
    return null;
  }
}
