import { Button } from 'primereact/button';

const ErrorPage: React.FC = () => {
  const handleHomeRedirect = () => {
    window.location.href = '/home'; // Redirect to the homepage
  };

  return (
    <div className="error-page w-full h-full flex flex-column align-items-center justify-content-center">
      <i className="pi pi-exclamation-triangle text-7xl text-pink-500 mb-4"></i>
      <h1 className="text-4xl font-bold text-600 mb-2">
        Oops! Something went wrong
      </h1>
      <p className="text-lg text-500 mb-5">
        We couldn't find the page you're looking for. Don't worry, it's probably
        just a small hiccup.
      </p>
      <Button
        label="Go to Homepage"
        icon="pi pi-home"
        className="p-button p-button-rounded p-button-lg"
        onClick={handleHomeRedirect}
      />
    </div>
  );
};

export default ErrorPage;
