import React from 'react';
import Container from '../assets/wrappers/LandingFeatured';
import { project1, project2, project3 } from '../assets/utils/data'; // Import your project data

const ProjectBox = ({ project }) => (
  <div className="project-box">
    <a href={`/${project.id}`} target="_blank" rel="noopener noreferrer">
      {project.title}
    </a>
  </div>
);

const LandingFeatured = () => (
  <Container>
    <section id="trends"></section>
    <div className="title-box special-sponsors">Weekly Top Trends</div>
    {project1.map((project) => (
      <ProjectBox key={project.id} project={project} />
    ))}
    <div className="title-box platinum-sponsors">All Time Trend</div>
    <ProjectBox project={project2[0]} />
    <div className="title-box gold-sponsors">Monthly Trends</div>
    {project3.map((project) => (
      <ProjectBox key={project.id} project={project} />
    ))}
  </Container>
);

export default LandingFeatured;
