import React from "react";
import Map from "./MapComponent";
import NavbarMap from "./NavbarMapComponent";

const MainSidebar = ({
  language,
  handleToggleSidebar,
  handleLanguageChange,
}) => {
  return (
    <main>
      <NavbarMap
        language={language}
        handleToggleSidebar={handleToggleSidebar}
        handleLanguageChange={handleLanguageChange}
      />
      <Map language={language} />
    </main>
  );
};

export default MainSidebar;
