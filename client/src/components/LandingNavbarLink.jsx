//Component used in LandingNavbarLinks
const LandingNavbarLink = ({ link, itemClass }) => {
  return (
    <li key={link.id}>
      <a href={link.href} className={itemClass}>
        {link.text}
      </a>
    </li>
  );
};
export default LandingNavbarLink;
