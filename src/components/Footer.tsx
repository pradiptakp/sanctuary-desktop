import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-lightBlue-900 dark:bg-blueGray-900">
      <div className="container mx-auto px-16 flex space-x-12 py-8">
        <div className="flex flex-1 space-x-8 items-center">
          <img
            src="https://ethol.pens.ac.id/pens_putih.png"
            alt="pens putih"
            className="w-10 h-10"
          />
        </div>
        <div className="flex-1 flex flex-col text-lightBlue-50">
          <div className="font-black uppercase text-xs tracking-wider text-blueGray-200 dark:text-blue-400 mb-4">
            Link
          </div>
          <a target="_blank" rel="noreferrer" href="https://www.pens.ac.id">
            PENS Website
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://ethol.pens.ac.id"
            className="mt-2"
          >
            ETHOL
          </a>
        </div>
        <div className="flex-1 text-lightBlue-50">
          <div className="font-black uppercase text-xs tracking-wider text-blueGray-200 dark:text-blue-400 mb-4">
            Contact
          </div>
          <div>Jl. Raya ITS - Kampus PENS Sukolilo Surabaya, Indonesia</div>
          <div>+62 31 594 7280</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
