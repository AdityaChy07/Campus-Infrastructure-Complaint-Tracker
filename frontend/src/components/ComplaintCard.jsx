function ComplaintCard({
  title,
  status,
  location,
}) {
  return (
    <div className="complaint-card">

      <h3>{title}</h3>

      <p>
        Location:
        {" "}
        {location}
      </p>

      <span
        className={`status ${status}`}
      >
        {status}
      </span>

    </div>
  );
}

export default ComplaintCard;