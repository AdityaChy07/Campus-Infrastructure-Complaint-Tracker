import { motion } from "framer-motion";

function StatCard({
  title,
  count,
}) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{
        scale: 1.05,
      }}
    >
      <h3>{title}</h3>

      <h1>{count}</h1>
    </motion.div>
  );
}

export default StatCard;