import { format } from 'date-fns';
import { Avatar } from 'primereact/avatar';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Flat } from '../components/Interfaces/FlatInterface';
import MessageForm from '../components/Messages/MessageForm';
import MessageList from '../components/Messages/MessageList';
import { useAuth } from '../hooks/useAuth';
import FlatImg from './../images/apt-21.jpg';
import BathroomIcon from './../images/bathroomIcon.svg';
import UserImg from './../images/profile.png';
import RoomIcon from './../images/roomIcon.svg';

interface FlatDetailsPageProps {
  flat: Flat;
}

const FlatDetailsPage: React.FC<FlatDetailsPageProps> = ({ flat }) => {
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
  const initialDate = flat.dateAvailable ? flat.dateAvailable[0] : null;
  const endDate =
    flat.dateAvailable && flat.dateAvailable.length > 1
      ? flat.dateAvailable[flat.dateAvailable.length - 1]
      : null;

  const formattedInitialDate = initialDate
    ? format(new Date(initialDate), 'd')
    : 'N/A';
  const formattedEndDate = endDate ? format(new Date(endDate), 'd MMM') : 'N/A';
  const formattedEndYear = endDate ? format(new Date(endDate), 'yyyy') : 'N/A'; // Year from the end date

  return (
    <>
      <div>
        <img
          alt={`${flat.streetNumber} ${flat.streetName}`}
          src={flat.flatImage || FlatImg}
          className="border-round-lg w-full"
        />
        <h2 className="text-primary  mb-0">${flat.rentPrice}</h2>

        {/* place */}
        <div className="flex text-500 gap-2 text-sm mt-1">
          <i className="pi pi-map-marker"></i>
          <p className="m-0">
            | {flat.name} | {flat.streetNumber} {flat.streetName}
          </p>
        </div>

        {/* owner */}
        {flat.ownerId && (
          <div className="mt-4 flex gap-2 align-items-center">
            <Avatar
              // image={userF.profile}
              image={UserImg}
              imageAlt={`${flat.ownerId.firstName} ${flat.ownerId.lastName}`}
              className="mr-2"
              size="large"
              shape="circle"
            />
            <div>
              <p className="text-600 m-0">
                Listed by {flat.ownerId.firstName} {flat.ownerId.lastName}
              </p>
              <p className="text-600 m-0">{flat.ownerId.email}</p>
            </div>
          </div>
        )}

        {/* flat details */}
        <div className="flex w-full justify-content-between surface-100 border-round-lg mt-4 p-3 text-600 align-items-center ">
          <div className="flex gap-2 w-full">
            <i className="pi pi-expand"></i>
            <p className="m-0">{flat.areaSize} m²</p>
          </div>
          <div className="flex gap-2 w-full">
            <img
              alt={`${flat.rooms} rooms`}
              src={RoomIcon}
              className="border-round-lg"
            />
            <p className="m-0">{flat.rooms} rooms</p>
          </div>
          <div className="flex gap-2 w-full">
            <img
              alt={`${flat.bathrooms} bathrooms`}
              src={BathroomIcon}
              className="border-round-lg"
            />
            <p className="m-0">{flat.bathrooms} baths</p>
          </div>
          <div className="flex gap-2 w-full">
            <i className="pi pi-asterisk"></i>
            <p className="m-0">{flat.hasAc ? 'Has AC' : 'No AC'}</p>
          </div>
        </div>
      </div>

      {/* flat details */}
      <div className="flex w-full justify-content-between surface-100 border-round-lg mt-2 p-3 text-600 align-items-center ">
        <div className="flex gap-2 w-full">
          <i className="pi pi-building"></i>
          <p className="m-0">
            Year Built:<strong> {flat.yearBuilt}</strong>
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <i className="pi pi-calendar"></i>
          <p className="m-0">
            Available from:{' '}
            <span className="font-bold">
              {' '}
              {formattedInitialDate}-{formattedEndDate} {formattedEndYear}
            </span>
          </p>
        </div>
      </div>
      {/* Messages list */}
      <MessageList
        flatId={flat._id}
        userEmail={user!.email}
        isAdmin={user!.isAdmin}
      />
      <MessageForm
        flatId={flat._id}
        userEmail={user!.email}
        isAdmin={user!.isAdmin}
      />
    </>
  );
};

export default FlatDetailsPage;
