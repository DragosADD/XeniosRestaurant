import { Link } from 'react-router-dom';

function Button({ children, disabled, to, type, onClick }) {
  const base =
    'rounded-md bg-lime-300 font-semibold text-cyan-900 hover:bg-lime-100 focus:bg-lime-100 focus:outline-none focus:ring focus:ring-lime-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-cyan-900';

  const styles = {
    primary: `${base} px-3 py-2 `,
    addButton: `${base} px-3 py-2`,
    deleteOrder: `${base} p-1 hover:bg-rose-200 focus:bg-rose-200`,
    clearButton: `rounded-full ml-2 p-1 border-2 border-transparent hover:border-cyan-500 text-cyan-800 hover:bg-lime-100 focus:bg-lime-100 focus:outline-none focus:ring focus:ring-lime-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-cyan-900`,
    edit: `${base} px-3 py-2 mr-3`,
    button: `rounded-full ml-2 p-1 border-2 border-transparent hover:border-cyan-500 text-cyan-800 hover:bg-lime-100 focus:bg-lime-100 focus:outline-none focus:ring focus:ring-lime-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-cyan-900`,
    submit: `${base} px-3 py-2 mt-2`,
  };
  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  return (
    <button
      disabled={disabled}
      className={styles[type]}
      onClick={onClick}
      type={type === 'submit' ? 'submit' : `button`}
    >
      {children}
    </button>
  );
}

export default Button;
