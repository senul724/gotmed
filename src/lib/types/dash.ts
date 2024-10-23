export type SideMenu = {
  menuItems: MenuItem[];
  name?: string;
};

export type MenuItem = {
  icon?: React.JSX.Element;
  label: string;
  route: string;
  children?: MenuChild[];
};

export type MenuChild = {
  label: string;
  route: string;
};
