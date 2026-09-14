function Footer() {
  const year = new Date().getFullYear();
  // Unique id for this site so the counter tracks only this portfolio's visits
  const pageId = "himmatlalparmar-portfolio-hpdev";

  return (
    <footer className="hpFooter">
      <div className="hpFooterInner">
        <p className="footerText">
          &copy; {year} Himmatlal Parmar. All rights reserved.
        </p>
        <div className="visitorCounter">
          <img
            src={`https://visitor-badge.laobi.icu/badge?page_id=${pageId}&left_color=1a1a1a&right_color=21e024&left_text=Visitors`}
            alt="Live visitor count"
            loading="lazy"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
