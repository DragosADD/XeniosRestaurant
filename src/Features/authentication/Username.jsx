import { Form, useRouteLoaderData } from 'react-router-dom';

function Username() {
  const name = 'Dediu Dragos';
  const user = useRouteLoaderData('root');

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="ml-6">
          Hi,{' '}
          {user
            ? user.user_metadata.name
            : `stranger! Please login or create and account`}
        </div>
        {user && (
          <Form action="/logout" method="POST">
            <button className="ml-6">Logout</button>
          </Form>
        )}
      </div>
    </>
  );
}

export default Username;
