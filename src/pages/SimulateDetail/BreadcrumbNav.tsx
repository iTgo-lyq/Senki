import React from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { makeStyles } from "@material-ui/core";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const BreadcrumbNav = () => {
  const classes = useStyles();
  return (
    <Breadcrumb className={classes.breadNav}>
      <Breadcrumb.Item>
        <Link to="/">
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <UserOutlined />
        <Link to="/algosimulate">
          <span>算法模拟</span>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>模拟详情</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;

const useStyles = makeStyles({
  breadNav: {
    padding: 13,
  },
});
