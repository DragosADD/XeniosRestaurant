import { redirect } from 'react-router-dom';
import supabase from '../../Services/supabase';

export async function action() {
  try {
    await supabase.auth.signOut();

    // Clear the authentication token from local storage
    localStorage.removeItem('supabase.auth.token');

    console.log('User logged out successfully');
    // Perform any additional cleanup or UI changes
  } catch (error) {
    console.error('Error logging out:', error.message);
  }

  return redirect('/');
}
