import { useState} from "react";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent
  } from 'react-pro-sidebar';
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaSave,
    FaTrash,
    FaPlus,
  } from 'react-icons/fa';
import { useLocalStorage } from "usehooks-ts";
import AddNewProcessor from "./Menues/AddNewProcessor";
import useStore from "./store";
  const downloadFile = (myData: any) => {
    const fileName = "my-file";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
  
    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
  
    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

const SideBar = (): JSX.Element =>{
    const [collapsed, setCollapsed] = useState(false);
    const [image, setImage] = useState(false);
    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value: boolean) => {
        setToggled(value);
    };
    const {toggleMidiMap, clearGlobals, clearMidiChain} = useStore()
    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
      };
      const [storeJSON, setStoreJSON] = useLocalStorage("midi-storage", undefined);
    
  return(
    <ProSidebar
    //   image={image ? sidebarBg : false}
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
    >
      {/* Header */}
      <SidebarHeader>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
              <div
                style={{
                  padding: '9px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 15,
                  letterSpacing: '1px'
                }}
              >
                Midima
              </div>
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <Menu iconShape="circle">
          {/* <MenuItem
            icon={<FaTachometerAlt />}
            suffix={<span className="badge red">NEW</span>}
          >
            Dashboard
          </MenuItem> */}
          {/* <MenuItem icon={<FaGem />}>Components </MenuItem> */}
          <MenuItem 
            onMouseDown={(e) => {
              downloadFile(storeJSON);
            }}
          icon={<FaPlus />}>
            <AddNewProcessor></AddNewProcessor>
          </MenuItem>
          <MenuItem 
                 onMouseDown={(e) => {
                    downloadFile(storeJSON);
                  }}
          icon={<FaSave />}>
            Save 
          </MenuItem>
          <MenuItem 
          onMouseDown={(e) => {
            toggleMidiMap()
          }}
          icon={<FaSave />}>
            Midi Map 
          </MenuItem>
          <MenuItem 
          onMouseDown={(e) => {
            clearGlobals()
            clearMidiChain()
          }}
          icon={<FaTrash />}>
            Clear 
          </MenuItem>
          {/* <MenuItem icon={<FaGem />}>
            Components 
          </MenuItem>
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title={'With Suffix'}
            icon={<FaRegLaughWink />}
          >
            <MenuItem>Submenu 1</MenuItem>
            <MenuItem>Submenu 2</MenuItem>
            <MenuItem>Submenu 3</MenuItem>
          </SubMenu> */}
          {/* <SubMenu
            // prefix={<span className="badge gray">3</span>}
            title={'With Prefix'}
            icon={<FaHeart />}
          >
            <MenuItem>Submenu 1</MenuItem>
            <MenuItem>Submenu 2</MenuItem>
            <MenuItem>Submenu 3</MenuItem>
          </SubMenu>
          <SubMenu title={'Multi Level'} icon={<FaList />}>
            <MenuItem>Submenu 1 </MenuItem>
            <MenuItem>Submenu 2 </MenuItem>
            <SubMenu title={'Submenu 3'}>
              <MenuItem>Submenu 3.1 </MenuItem>
              <MenuItem>Submenu 3.2 </MenuItem>
            </SubMenu>
          </SubMenu> */}
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: 'center' }}>
        <div className="sidebar-btn-wrapper" style={{ padding: '16px' }}>
          {/* <Link
            className="sidebar-btn"
            style={{ cursor: 'pointer' }}
            to="/profile"
          >
            <FaUser />
            <span>My Account</span>
          </Link> */}
        </div>
      </SidebarFooter>
    </ProSidebar>
  )
}

export default SideBar
