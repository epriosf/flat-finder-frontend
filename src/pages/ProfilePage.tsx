import { Image } from 'primereact/image';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ProfileView from '../components/Users/ProfileView';
import { useAuth } from '../hooks/useAuth';
import NewFlatImg from './../images/new-flat-img.png';
const Profilepage = () => {
  const { user, loading } = useAuth(); // Assume `useAuth` provides `isLoading`
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div>
        <i className="pi pi-spin pi-spinner"></i> Loading...
      </div>
    );
  }

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
          <h1 className="font-normal">User Profile</h1>
          <ProfileView user={user!} />
        </div>
      </div>
    </>
  );
};

export default Profilepage;
