import React, { useEffect } from "react";
import NavbarLanding from "./NavbarLandingComponent";
import LandingFirstSection from "./LandingFirstSectionComponent";
import LandingSecondSection from "./LandingSecondSectionComponent";
import LandingThirdSection from "./LandingThirdSectionComponent";
import LandingFourthSection from "./LandingFourthSectionComponent";
import LandingFifthSection from "./LandingFifthSectionComponent";
import LandingSixthSection from "./LandingSixthSectionComponent";
import LandingSeventhSection from "./LandingSeventhSectionComponent";
import LandingFooterComponent from "./LandingFooterComponent";
import Toolbar from "@material-ui/core/Toolbar";
import { useDispatch, useSelector } from "react-redux";

import { fetchLandingStats } from "../redux/ActionCreators";

export default function Landing({ language, setLanguage }) {
  const dispatch = useDispatch();

  const landingStats = useSelector((state) => state.landingStats);

  useEffect(() => {
    dispatch(fetchLandingStats());
  }, [dispatch]);

  let dataLandingStats;

  if (landingStats.isLoading) {
    dataLandingStats = (
      <LandingThirdSection categories="···" points="···" users="···" />
    );
  } else if (landingStats.errMess) {
    dataLandingStats = (
      <LandingThirdSection categories="-" points="-" users="-" />
    );
  } else {
    let arrayStats = landingStats.landingStats;
    dataLandingStats = (
      <LandingThirdSection
        categories={arrayStats.categories}
        points={arrayStats.points}
        users={arrayStats.users}
      />
    );
  }

  return (
    <>
      <NavbarLanding language={language} setLanguage={setLanguage} />
      <Toolbar />
      <LandingFirstSection />
      <LandingSecondSection />
      {dataLandingStats}
      <LandingFourthSection />
      <LandingFifthSection />
      <LandingSixthSection />
      <LandingSeventhSection />
      <LandingFooterComponent />
    </>
  );
}
