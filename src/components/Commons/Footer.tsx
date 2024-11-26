const Footer = () => {
  return (
    <>
      <footer
        id="footer"
        className="footer z-5 bg-indigo-100 px-4 w-full justify-content-between flex-column flex align-items-center sm:flex-row"
      >
        <h4 className="text-600 w-max">
          © Copyright 2024. All rights reserved.
        </h4>
        <ul className="list-none p-0 m-0 flex gap-3 w-max mb-3 sm:mb-0">
          <li>
            <a
              className="no-underline"
              href="https://www.instagram.com/airbnb/"
            >
              <i className="pi pi-instagram text-600"></i>
            </a>
          </li>
          <li>
            <a className="no-underline" href="https://www.facebook.com/airbnb">
              <i className="pi pi-facebook text-600"></i>
            </a>
          </li>
          <li>
            <a className="no-underline" href="https://twitter.com/airbnb">
              <i className="pi pi-twitter text-600"></i>
            </a>
          </li>
          <li>
            <a
              className="no-underline"
              href="https://www.linkedin.com/company/airbnb"
            >
              <i className="pi pi-linkedin text-600"></i>
            </a>
          </li>
          <li>
            <a className="no-underline" href="https://www.youtube.com/airbnb">
              <i className="pi pi-youtube text-600"></i>
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
};
export default Footer;
