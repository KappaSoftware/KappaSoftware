import React, { useEffect } from "react";
import {
  fetchCategoriesAndSubcategories,
  postSubcategoryMap,
} from "../redux/ActionCreators";
import { useDispatch, useSelector } from "react-redux";

import { useIntl } from "react-intl";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { FaGithub, FaRegLaughWink, FaHandsHelping } from "react-icons/fa";
import Switch from "react-switch";
import { NavLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

export default function SidebarMap({
  toggled,
  collapsed,
  rtl,
  language,
  handleToggleSidebar,
  handleCollapsedChange,
  handleRtlChange,
}) {
  const intl = useIntl();

  const subcategoriesMap = useSelector((state) => state.subcategoriesMap);

  const dataCategoriesAndSubcategories = useSelector(
    (state) => state.categoriesAndSubcategories
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesAndSubcategories());
  }, [dispatch]);

  let dataCatAndSub;

  if (dataCategoriesAndSubcategories.isLoading) {
    dataCatAndSub = (
      <li className="sidebar-menu-loading">
        <span>Cargando...</span>
      </li>
    );
  } else if (dataCategoriesAndSubcategories.errMess) {
    dataCatAndSub = <h4>{dataCategoriesAndSubcategories.errMess}</h4>;
  } else {
    dataCatAndSub =
      dataCategoriesAndSubcategories.categoriesAndSubcategories.map(
        (catAndSub) => (
          <SubMenu
            key={catAndSub._id}
            title={language === "es" ? catAndSub.Name_es : catAndSub.Name_en}
            icon={<FaRegLaughWink />}
          >
            {catAndSub.subcategories.map((subcategory) => {
              let isChecked = subcategoriesMap[subcategory._id];
              if (typeof isChecked === "undefined") {
                dispatch(postSubcategoryMap(subcategory._id, false));
                isChecked = false;
              }
              return (
                <MenuItem key={subcategory._id}>
                  <Switch
                    height={16}
                    width={30}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onChange={() => {
                      dispatch(
                        postSubcategoryMap(
                          subcategory._id,
                          !subcategoriesMap[subcategory._id]
                        )
                      );
                    }}
                    checked={isChecked}
                    onColor={subcategory.Color}
                    offColor="#bbbbbb"
                    className="switch-itemvertical"
                  />{" "}
                  {language === "es"
                    ? subcategory.Name_es
                    : subcategory.Name_en}
                </MenuItem>
              );
            })}
          </SubMenu>
        )
      );
  }

  return (
    <ProSidebar
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        {collapsed ? (
          <div
            style={{
              padding: "24px",
              fontSize: 14,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <img
              src="/kappaLogo.png"
              width="30"
              height="30"
              className="d-inline-block align-center"
              alt="React Bootstrap logo"
            />
          </div>
        ) : (
          <div
            style={{
              padding: "24px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: "1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <NavLink to="/home">
              <img
                src="/kappaLogo.png"
                width="30"
                height="30"
                className="d-inline-block align-center"
                alt="React Bootstrap logo"
              />
            </NavLink>
            <NavLink to="/home" style={{ color: "white", paddingLeft: "10px" }}>
              {intl.formatMessage({ id: "map_sidebar_title" })}
            </NavLink>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <Menu>
          <MenuItem
            icon={
              <Switch
                height={16}
                width={30}
                checkedIcon={false}
                uncheckedIcon={false}
                onChange={handleCollapsedChange}
                checked={collapsed}
                onColor="#009696"
                offColor="#bbbbbb"
              />
            }
          >
            {intl.formatMessage({ id: "map_sidebar_title_collapse" })}
          </MenuItem>
          <MenuItem
            icon={
              <Switch
                height={16}
                width={30}
                checkedIcon={false}
                uncheckedIcon={false}
                onChange={handleRtlChange}
                checked={rtl}
                onColor="#009696"
                offColor="#bbbbbb"
              />
            }
          >
            <span onClick={handleRtlChange}>
              {intl.formatMessage({ id: "map_sidebar_title_changeposition" })}
            </span>
          </MenuItem>
          <MenuItem icon={<FaHandsHelping />}>
            <a className="nav-link" href="/help">
              {intl.formatMessage({
                id: "landing_navbar_title_help",
              })}
            </a>
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <li className="header-menu">
            {collapsed ? (
              <span>Cat.</span>
            ) : (
              <span>
                {intl.formatMessage({ id: "map_sidebar_title_categories" })}
              </span>
            )}
          </li>
          {dataCatAndSub}
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: "center" }}>
        <Typography variant="body2" style={{ marginTop: "5px" }}>
          {intl.formatMessage({ id: "map_sidebar_footer_title1" })}{" "}
          <NavLink to="/disclaimer" style={{ color: "#f50057" }}>
            {intl.formatMessage({ id: "map_sidebar_footer_title2" })}
          </NavLink>
          .
        </Typography>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: "20px 24px",
          }}
        >
          <a
            href="https://github.com/KappaSoftware/KappaSoftware"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span> {intl.formatMessage({ id: "title" })}</span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
}
