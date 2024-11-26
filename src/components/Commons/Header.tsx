import LogoWhite from './../../images/logo-white.svg';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import Navbar from './Navbar';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { user } = useAuth();

  // const btnRef1 = useRef<any>(null);
  // const btnRef2 = useRef<any>(null);
  // const btnRef3 = useRef<any>(null);
  // const btnRef4 = useRef<any>(null);

  return (
    <>
      <header
        id="header"
        className="header flex w-full bg-indigo-900 text-white p-3 justify-content-between fixed"
      >
        <div className="flex gap-3 align-items-center">
          <a href="/home">
            <Image src={LogoWhite} alt="Image" width="115" />
          </a>
          <p>Hello {user?.firstName}!</p>
        </div>
        <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
      </header>
      <Navbar visible={visible} setVisible={setVisible} />
    </>
  );
};

export default Header;
