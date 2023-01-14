import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import PDFViewer from '~/components/PDFViewer';

const IndexPage = () => {
  return (
    <LandingLayout>
      <div className="flex justify-center items-center p-2">
        <PDFViewer pdfUrl={'/legal/responsiblegaming.pdf'} />
      </div>
    </LandingLayout>
  );
};

export default IndexPage;
