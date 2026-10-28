import { useId, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Cpu, Wrench } from "lucide-react";
import styles from "./public-cards.module.css";

interface ProjectHardwareCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    status?: string;
    tags?: string[];
  };
}

export function ProjectHardwareCard({ project }: ProjectHardwareCardProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const descriptionId = useId();
  const description = project?.description || "";
  const title = project?.title || "Robotics Project";
  const hasLongDescription = description.length > 180;
  const tags = project?.tags?.length ? project.tags : [
    title.toLowerCase().includes("arm") ? "Robotic arm" :
      title.toLowerCase().includes("maze") ? "Autonomous" :
        title.toLowerCase().includes("soccer") ? "Competition bot" : "Maker lab",
    "3D designed",
  ];

  return (
    <article className={styles.projectCard}>
      <div className={styles.projectVisual}>
        {project?.image?.trim() ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.projectImage} src={project.image.trim()} alt={title} loading="lazy" />
        ) : (
          <div className={styles.projectPlaceholder} aria-hidden="true"><Cpu size={42} strokeWidth={1.2} /></div>
        )}
        <span className={styles.projectStatus}><span />{project?.status || "Building in the lab"}</span>
      </div>
      <div className={styles.projectBody}>
        <div className={styles.tagList}>{(tags || []).slice(0, 3).map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}</div>
        <h3>{title}</h3>
        <p
          className={`${styles.projectDescription} ${descriptionExpanded ? styles.projectDescriptionExpanded : ""}`}
          id={descriptionId}
        >
          {description}
        </p>
        {hasLongDescription && (
          <button
            type="button"
            className={styles.readDetailsButton}
            aria-expanded={descriptionExpanded}
            aria-controls={descriptionId}
            onClick={() => setDescriptionExpanded((expanded) => !expanded)}
          >
            {descriptionExpanded ? "Show less" : "Read full project details"}
            {descriptionExpanded ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />}
          </button>
        )}
        <div className={styles.projectFoot}><span><Wrench size={15} /> Prototype project</span><ArrowUpRight size={18} aria-hidden="true" /></div>
      </div>
    </article>
  );
}
