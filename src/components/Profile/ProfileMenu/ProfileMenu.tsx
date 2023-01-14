import React from 'react';
import Icons from '~/components/Icons/Icons';

export interface SettingsItemMenuProps {
  /**
   * Menu Key
   */
  key: string;
  /**
   * Menu label
   */
  label: string;
  /**
   * Icon
   */
  icon?: JSX.Element;
}

interface SettingsMenuProps {
  /**
   * Menu lists
   */
  menus: SettingsItemMenuProps[];
  /**
   * Select Callback
   */
  onSelectCallback(key: SettingsItemMenuProps): void;
  /**
   * Active menu
   */
  activeMenu?: SettingsItemMenuProps | null;
}

const ProfileMenu = (props: SettingsMenuProps) => {
  const handleSelect = (selectedMenu: SettingsItemMenuProps) => {
    props.onSelectCallback(selectedMenu);
  };

  return (
    <div className="h-fit overflow-y-auto shadow-lg w-full">
      <ul className="space-y divide-y">
        {props.menus.map((menu) => (
          <li key={menu.key}>
            <button
              type="button"
              className={`flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 group hover:bg-white
              ${
                props.activeMenu?.key === menu.key
                  ? 'bg-white border border-gray-100 shadow-md'
                  : ''
              } 
              `}
              aria-controls="dropdown-example"
              data-collapse-toggle="dropdown-example"
              onClick={() => handleSelect(menu)}
            >
              <div className="w-5">{menu.icon}</div>
              <span className="flex-1 ml-5 text-left whitespace-nowrap text-sm w-auto">
                {menu.label}
              </span>
              <Icons.ChevronRight className={'h-6 w-6'} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileMenu;
