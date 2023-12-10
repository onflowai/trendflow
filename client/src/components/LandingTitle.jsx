const LandingTitle = ({ title, subTitle }) => {
  return (
    <div className="section-title">
      <h6>
        {title} <span>{subTitle}</span>
      </h6>
    </div>
  );
};
export default LandingTitle;
