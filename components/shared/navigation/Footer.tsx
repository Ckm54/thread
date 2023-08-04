import NavLinks from "@/components/shared/navigation/NavLinks";

const Footer = () => {
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        <NavLinks isFooter />
      </div>
    </section>
  );
};

export default Footer;
