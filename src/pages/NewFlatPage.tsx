import FlatForm from '../components/Flats/FlatForm';
import NewFlatImg from './../images/new-flat-img.png';
import { Image } from 'primereact/image';

const NewFlatPage = () => {
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
