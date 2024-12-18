import { Image } from 'primereact/image';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlatForm from '../components/Flats/FlatForm';
import { useAuth } from '../hooks/useAuth';
import NewFlatImg from './../images/new-flat-img.png';

const NewFlatPage = () => {
  const { user: loggedUser } = useAuth();
  const navigate = useNavigate(); // React Router navigate function
  useEffect(() => {
    if (loggedUser === null) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login'); // Navigate to login if no token exists
      }
    }
  }, [loggedUser, navigate]);
  return (
    <>
      <div className="w-full h-full flex gap-0">
        <div className="w-6 hidden md:block">
          <Image
            id="newFlatImg"
            className="w-full h-full"
            src={NewFlatImg}
            alt="New Flat Background"
          />
        </div>
        <div className="w-full md:w-6">
          <h1 className="font-normal">Create New Flat</h1>
          <FlatForm isEditing={false} />
        </div>
      </div>
    </>
  );
};

export default NewFlatPage;
