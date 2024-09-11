import FoodLogForm from '../../components/forms/FoodLogForm';
import { useAuth } from '../../utils/context/authContext';

function NewGame() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Add to Food Log</h2>
      <FoodLogForm user={user} />
    </div>
  );
}

export default NewGame;