import { Link, useNavigate } from 'react-router-dom';

function LinkButton(props) {
  const navigate = useNavigate();
  const className = 'text-sm text-blue-200 hover:text-blue-600 hover:underline';
  if (props.to === '-1')
    return (
      <button className={className} onClick={() => navigate(-1)}>
        {props.children}
      </button>
    );
  return (
    <Link className={className} to={props.to}>
      {props.children}
    </Link>
  );
}

export default LinkButton;
