export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      {icon && <div className="text-gray-300 text-5xl mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}
