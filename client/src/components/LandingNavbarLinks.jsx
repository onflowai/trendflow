import { landingLinks } from '../assets/utils/data';
import LandingNavbarLink from './LandingNavbarLink';
const LandingNavbarLinks = ({ parentClass, itemClass }) => {
  return (
    <ul className={parentClass} id="nav-links">
      {landingLinks.map((link) => {
        return (
          <LandingNavbarLink key={link.id} link={link} itemClass={itemClass} />
        );
      })}
    </ul>
  );
};
export default LandingNavbarLinks;
