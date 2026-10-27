import React from "react";
import { ArrowUpRight, Cpu, Wrench } from "lucide-react";
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
  const tags = project.tags?.length ? project.tags : [
    project.title.toLowerCase().includes("arm") ? "Robotic arm" :
      project.title.toLowerCase().includes("maze") ? "Autonomous" :
        project.title.toLowerCase().includes("soccer") ? "Competition bot" : "Maker lab",
    "3D designed",
  ];

  return (
    <article className={styles.projectCard}>
      <div className={styles.projectVisual}>
        {project.image?.trim() ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.projectImage} src={project.image.trim()} alt={project.title} loading="lazy" />
        ) : (
          <div className={styles.projectPlaceholder} aria-hidden="true"><Cpu size={42} strokeWidth={1.2} /></div>
        )}
        <span className={styles.projectStatus}><span />{project.status || "Building in the lab"}</span>
      </div>
      <div className={styles.projectBody}>
        <div className={styles.tagList}>{tags.slice(0, 3).map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className={styles.projectFoot}><span><Wrench size={15} /> Prototype project</span><ArrowUpRight size={18} aria-hidden="true" /></div>
      </div>
    </article>
  );
}
