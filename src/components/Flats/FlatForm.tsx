import { Timestamp } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { FloatLabel } from 'primereact/floatlabel';
import { IconField } from 'primereact/iconfield';
import { Image } from 'primereact/image';
import { InputIcon } from 'primereact/inputicon';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import {
  createFlat,
  uploadFlatImage,
  updateFlat,
} from '../../services/firebase';
import GeneralInput from '../Commons/Inputs/GeneralInput';
import FormErrorMessage from '../Commons/Inputs/MessageErrors';
import { Flat } from '../Interfaces/FlatInterface';

const today = new Date();
let minDate = new Date(today);
let maxDate = new Date(today);
const currentYear = new Date().getFullYear();
const minYearDate = new Date(1900, 0, 1);
const maxYearDate = new Date(new Date().getFullYear(), 11, 31); // Current year

maxDate.setFullYear(today.getFullYear() + 2);

// Validation schema for the flat form
const FlatSchema = Yup.object({
  areaSize: Yup.number().nullable().required('Area Size Required'),
  city: Yup.string()
    .min(2, 'City must have at least 2 characters')
    .required('City Required'),
  dateAvailable: Yup.date()
    .required('Date Available Required')
    .min(minDate, 'Date needs to be in the future')
    .max(maxDate, 'Date cannot be more than 2 years in the future'),
  hasAc: Yup.boolean().required('AC Requirement Required'),
  price: Yup.number().nullable().required('Price Required'),
  streetName: Yup.string()
    .min(2, 'Street Name must have at least 2 characters')
    .required('Street Name Required'),
  streetNumber: Yup.number().nullable().required('Street Number Required'),
  yearBuilt: Yup.number()
    .nullable()
    .min(1900, 'Year Built must be after 1900')
    .max(currentYear, `Year Built cannot be later than ${currentYear}`)
    .required('Year Built is required'),
  rooms: Yup.number().nullable().required('Rooms Required'),
  bathrooms: Yup.number().nullable().required('Bathrooms Required'),
});

interface FlatFormProps {
  initialFlat?: Flat;
  isEditing?: boolean;
  onFormSubmit?: () => void; // Ensure this is correctly typed
}

const FlatForm: React.FC<FlatFormProps> = ({
  initialFlat,
  isEditing = false,
  onFormSubmit,
}) => {
  const [flatFile, setFlatFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      areaSize: initialFlat?.areaSize || (null as number | null),
      city: initialFlat?.city || '',
      dateAvailable: initialFlat?.dateAvailable
        ? initialFlat.dateAvailable instanceof Timestamp
          ? initialFlat.dateAvailable.toDate()
          : initialFlat.dateAvailable
        : null,
      hasAc: initialFlat?.hasAc || false,
      price: initialFlat?.price || (null as number | null),
      streetName: initialFlat?.streetName || '',
      streetNumber: initialFlat?.streetNumber || (null as number | null),
      yearBuilt: initialFlat?.yearBuilt || (null as number | null),
      flatImage: initialFlat?.flatImage || '',
      rooms: initialFlat?.rooms || (null as number | null),
      bathrooms: initialFlat?.bathrooms || (null as number | null),
    },
    validationSchema: FlatSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!user?.email) {
        // Handle the error appropriately, such as displaying a message to the user
        console.error('User is not logged in or email is not available.');
        return;
      }
      let imageUrl = initialFlat?.flatImage || '';

      try {
        if (flatFile) {
          imageUrl = await uploadFlatImage(flatFile);
        }

        const flatData: Omit<Flat, 'flatId'> = {
          city: values.city,
          areaSize: values.areaSize,
          dateAvailable: values.dateAvailable
            ? values.dateAvailable
            : Timestamp.now(),
          hasAc: values.hasAc,
          price: values.price,
          streetName: values.streetName,
          streetNumber: values.streetNumber,
          yearBuilt: values.yearBuilt,
          rooms: values.rooms,
          bathrooms: values.bathrooms,
          flatUser: user.email || '', // Set the flatUser to the logged-in user's email
          flatImage: imageUrl,
        };

        if (isEditing && initialFlat?.flatId) {
          try {
            await updateFlat({ ...flatData, flatId: initialFlat.flatId });
            if (onFormSubmit) {
              onFormSubmit(); // Close the dialog if the function is provided
              window.location.reload(); // Refresh the page when the dialog closes
            }
            // navigate('/home');
          } catch (error) {
            console.error('Error updating flat:', error);
          }
        } else {
          try {
            const flatId = await createFlat(flatData);
            console.log('Flat created successfully with ID:', flatId);
            console.log('Navigating to home...');
            navigate('/home');
          } catch (error) {
            console.error('Error creating flat:', error);
          }
        }

        resetForm();
        setFlatFile(null);
      } catch (error) {
        console.error('Error creating flat:', error);
      }
    },
  });

  const handleUploadImage = async (e: FileUploadHandlerEvent) => {
    const file = e.files[0];
    setFlatFile(file);
  };

  const handleDateChange = (
    field: string,
    value: Date | Date[] | undefined,
  ) => {
    const date =
      value instanceof Date ? value : Array.isArray(value) ? value[0] : null;
    formik.setFieldValue(field, date);
  };
  return (
    <>
      <form
        id="newFlatForm"
        className="w-full flex flex-column gap-5 "
        onSubmit={formik.handleSubmit}
      >
        {/* Display error message if any */}
        {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
          <Message
            severity="error"
            text="Please correct the errors in the form."
            className="w-full justify-content-start text-pink-300 bg-indigo-800"
            id="error-message"
          />
        )}
        {/* Street Name and Street Number */}
        <div className="flex gap-3 w-full flex-column md:flex-row">
          {/* Street Number */}
          <div className="flex-1">
            <GeneralInput
              id="streetNumber"
              name="streetNumber"
              value={formik.values.streetNumber ?? ''}
              onChange={formik.handleChange}
              iconClass="pi pi-hashtag text-500"
              label="Street Number"
              type="text" // Specify the type if it's expected to be text
            />
            <FormErrorMessage
              touched={formik.touched.streetNumber}
              error={formik.errors.streetNumber}
            />
          </div>

          {/* Street Name */}
          <div className="flex-1">
            <GeneralInput
              id="streetName"
              name="streetName"
              value={formik.values.streetName}
              onChange={formik.handleChange}
              iconClass="pi pi-user text-500"
              label="Street Name"
              type="text" // Specify the type if it's expected to be text
            />
            <FormErrorMessage
              touched={formik.touched.streetName}
              error={formik.errors.streetName}
            />
          </div>
        </div>

        {/* Area & City */}
        <div className="flex gap-3 w-full md:flex-row flex-column">
          {/* City */}
          <div className="flex-1">
            <GeneralInput
              id="city"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              iconClass="pi pi-map-marker text-500"
              label="City"
            />
            <FormErrorMessage
              touched={formik.touched.city}
              error={formik.errors.city}
            />
          </div>

          {/* Price */}
          <div className="flex-1">
            <GeneralInput
              id="price"
              name="price"
              value={formik.values.price ?? ''}
              onChange={formik.handleChange}
              iconClass="pi pi-dollar text-500"
              label="Price"
            />
            <FormErrorMessage
              touched={formik.touched.price}
              error={formik.errors.price}
            />
          </div>
        </div>

        {/* Rooms & Bathrooms */}
        <div className="flex gap-3 w-full md:flex-row flex-column">
          {/* Rooms */}
          <div className="flex-1">
            <GeneralInput
              id="rooms"
              name="rooms"
              value={formik.values.rooms ?? ''}
              onChange={formik.handleChange}
              iconClass="pi pi-building text-500"
              label="Rooms"
            />
            <FormErrorMessage
              touched={formik.touched.rooms}
              error={formik.errors.rooms}
            />
          </div>

          {/* Bathrooms */}
          <div className="flex-1">
            <GeneralInput
              id="bathrooms"
              name="bathrooms"
              value={formik.values.bathrooms ?? ''}
              onChange={formik.handleChange}
              iconClass="pi pi-building text-500"
              label="Bathrooms"
            />
            <FormErrorMessage
              touched={formik.touched.bathrooms}
              error={formik.errors.bathrooms}
            />
          </div>
        </div>

        {/* Year & Date Available */}
        <div className="flex gap-3 w-full md:flex-row flex-column">
          {/* Year */}
          <div className="flex-1">
            <FloatLabel>
              <IconField iconPosition="left">
                <InputIcon className="pi pi-calendar text-500"> </InputIcon>
                <Calendar
                  id="yearBuilt"
                  value={
                    formik.values.yearBuilt !== null
                      ? new Date(formik.values.yearBuilt, 0, 1)
                      : null
                  } // Convert year to Date
                  onChange={(e) => {
                    const selectedDate = e.value as Date;
                    if (selectedDate) {
                      formik.setFieldValue(
                        'yearBuilt',
                        selectedDate.getFullYear(),
                      );
                    }
                  }}
                  view="year"
                  dateFormat="yy"
                  minDate={minYearDate} // Limit to years after 1900
                  maxDate={maxYearDate} // Limit to the current year
                  yearNavigator // Enables a dropdown for selecting the year
                  className="w-full"
                />
              </IconField>
              <label htmlFor="yearBuilt" className="left-3 text-400">
                Year Built
              </label>
            </FloatLabel>
            <FormErrorMessage
              touched={formik.touched.yearBuilt}
              error={formik.errors.yearBuilt}
            />
          </div>

          {/* Date Available */}
          <div className="flex-1">
            <FloatLabel>
              <IconField iconPosition="left">
                <InputIcon className="pi pi-calendar text-500"> </InputIcon>
                <Calendar
                  id="dateAvailable"
                  value={formik.values.dateAvailable}
                  onChange={(e) =>
                    handleDateChange(
                      'dateAvailable',
                      e.value as Date | undefined,
                    )
                  }
                  minDate={minDate}
                  maxDate={maxDate}
                  dateFormat="dd/mm/yy"
                  className="w-full"
                />
              </IconField>
              <label htmlFor="dateAvailable" className="left-3 text-400">
                Date Available
              </label>
            </FloatLabel>
            <FormErrorMessage
              touched={formik.touched.dateAvailable}
              error={formik.errors.dateAvailable}
            />
          </div>
        </div>

        {/* Area Size & Has AC */}
        <div className="flex gap-3 w-full md:flex-row flex-column">
          {/* Area Size */}
          <div className="w-full">
            <GeneralInput
              id="areaSize"
              name="areaSize"
              value={formik.values.areaSize ?? ''}
              onChange={formik.handleChange}
              iconClass="pi pi-expand text-500"
              label="Area Size"
            />
            <FormErrorMessage
              touched={formik.touched.areaSize}
              error={formik.errors.areaSize}
            />
          </div>

          {/* Has AC */}
          <div className="w-full justify-content-start align-items-center gap-3 flex ">
            <InputSwitch
              checked={formik.values.hasAc}
              onChange={(e: InputSwitchChangeEvent) =>
                formik.setFieldValue('hasAc', e.value)
              }
              id="hasAC"
            />
            <label htmlFor="hasAC">Has AC</label>
          </div>
          <FormErrorMessage
            touched={formik.touched.hasAc}
            error={formik.errors.hasAc}
          />
        </div>

        {/* Image */}
        {initialFlat?.flatImage && (
          <Image
            src={initialFlat?.flatImage}
            alt={initialFlat?.streetNumber + ' ' + initialFlat?.streetName}
            className="flat-img-form object-cover "
            width="150"
          />
        )}

        <FileUpload
          name="demo[]"
          multiple={false}
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">Drag and drop images to here to upload.</p>
          }
          chooseLabel="Photo"
          customUpload
          auto
          uploadHandler={handleUploadImage}
        />

        {/* Button */}
        <Button
          label={isEditing ? 'Update Flat' : 'Create Flat'}
          type="submit"
          className="w-full bg-indigo-500 text-white"
        />
      </form>
    </>
  );
};
export default FlatForm;
