import Logo from './../../images/logo.svg';
import { Sidebar } from 'primereact/sidebar';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import MainNavigation from './Navigations/MainNavigation';

interface NavbarProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Navbar = ({ visible, setVisible }: NavbarProps) => {
  return (
    <div className="card flex justify-content-center">
      <Sidebar
        // visible={visible}
        // position="right"
        // onHide={() => setVisible(false)}
        // content={({ closeIconRef, hide }) => (
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        content={() => (
          <div className="min-h-screen flex relative lg:static surface-ground">
            <div
              id="app-sidebar-2"
              className="surface-section w-full h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
              style={{ width: '280px' }}
            >
              <div className="flex flex-column h-full">
                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                  <span className="inline-flex align-items-center gap-2">
                    <span className="font-semibold text-2xl text-primary">
                      <a href="home.html">
                        <Image src={Logo} alt="Image" width="115" />
                      </a>
                    </span>
                  </span>
                  <span>
                    <Button
                      type="button"
                      icon="pi pi-times"
                      onClick={() => setVisible(false)}
                      rounded
                      outlined
                      className="h-2rem w-2rem"
                    />
                    {/* <Button
                      type="button"
                      ref={closeIconRef}
                      onClick={(e) => hide(e)}
                      icon="pi pi-times"
                      rounded
                      outlined
                      className="h-2rem w-2rem"
                    ></Button> */}
                  </span>
                </div>
                <MainNavigation setVisible={setVisible} />
              </div>
            </div>
          </div>
        )}
      ></Sidebar>
    </div>
  );
};

export default Navbar;
