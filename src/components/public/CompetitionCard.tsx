import { CalendarDays, MapPin, Trophy, ArrowRight } from "lucide-react";
import styles from "./public-cards.module.css";

export interface Segment {
  id: string;
  name: string;
  fee: number;
  maxParticipants?: number;
  description?: string;
}

export interface CompetitionCardItem {
  id: string;
  name: string;
  date?: string;
  location?: string;
  description?: string;
  segments?: Segment[];
  fee?: number;
  maxParticipants?: number;
  visibility?: string;
  status?: string;
}

interface CompetitionCardProps {
  comp: CompetitionCardItem;
  onRegister: (comp: CompetitionCardItem) => void;
}

export function CompetitionCard({ comp, onRegister }: CompetitionCardProps) {
  const segments = Array.isArray(comp.segments) && comp.segments.length
    ? comp.segments
    : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

  return (
    <article className={styles.competitionCard}>
      <div className={styles.competitionTop}>
        <div>
          <div className={styles.eyebrow}><Trophy size={14} /> Open tournament</div>
          <h3>{comp.name}</h3>
        </div>
        <div className={styles.competitionIcon}><Trophy size={21} /></div>
      </div>
      <div className={styles.competitionMeta}>
        <span><CalendarDays size={15} />{comp.date || "Date to be announced"}</span>
        <span><MapPin size={15} />{comp.location || "Club arena"}</span>
      </div>
      {comp.description && <p className={styles.competitionDescription}>{comp.description}</p>}
      <p className={styles.segmentHeading}>Competition categories</p>
      <div className={styles.segments}>
        {segments.map((segment) => (
          <span className={styles.segment} key={segment.id}>
            {segment.name}{segment.fee > 0 && <span className={styles.segmentFee}>{segment.fee} BDT</span>}
          </span>
        ))}
      </div>
      <button type="button" className={styles.registerButton} onClick={() => onRegister(comp)}>
        Register for competition <ArrowRight size={16} />
      </button>
    </article>
  );
}
