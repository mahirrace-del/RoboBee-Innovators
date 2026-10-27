import { Trophy } from "lucide-react";
import styles from "./public-cards.module.css";

interface AchievementBentoCardProps {
  achievement: { id: string; title: string; year: string; description: string; image?: string };
}

export function AchievementBentoCard({ achievement }: AchievementBentoCardProps) {
  const international = /malaysia|international/i.test(`${achievement.title} ${achievement.description}`);
  const national = /firso|uiu|national/i.test(`${achievement.title} ${achievement.description}`);
  const label = international ? "International milestone" : national ? "National milestone" : "Award of excellence";

  return (
    <article className={styles.achievementCard}>
      <div className={styles.achievementTop}>
        <div className={styles.achievementLabel}><span className={styles.achievementIcon}><Trophy size={18} /></span>{label}</div>
        <span className={styles.year}>{achievement.year}</span>
      </div>
      {achievement.image?.trim() && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.achievementImage} src={achievement.image.trim()} alt={achievement.title} loading="lazy" />
      )}
      <h3>{achievement.title}</h3>
      <p>{achievement.description}</p>
    </article>
  );
}
