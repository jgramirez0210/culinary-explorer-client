import FoodLogForm from '../../components/forms/FoodLogForm';
import { useAuth } from '../../utils/context/authContext';

function NewGame() {
  const { user } = useAuth();
  return (
    <div>
      <FoodLogForm user={user} />
    </div>
  );
}

export default NewGame;
