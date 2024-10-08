function DishHoverCard({ dish }) {
  if (!dish) {
    return null; // or a fallback UI
  }

  return (
    <div className="dish-hover-card">
      <h3>{dish.name}</h3>
      <p>{dish.restaurant}</p>
      {/* Other dish details */}
    </div>
  );
}
export default DishHoverCard;