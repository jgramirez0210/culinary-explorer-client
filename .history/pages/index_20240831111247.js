import { Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();
  return (
    <div>
      {/* <h1>Hello {user.fbUser.displayName}! </h1>
      <p>Click the button below to logout!</p> */}
      <div width="50rem" className="d-flex flex-wrap justify-content-evenly">
        {items.map((item) => (
          <ItemCard key={item.id} itemObj={item} onUpdate={getAllItems} />
        ))}
      </div>
    </div>
  );
}

export default Home;
