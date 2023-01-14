import React, { useState, useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useElementSize } from 'usehooks-ts';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Props {
  pdfUrl: string;
}

const PDFViewer = (props: Props) => {
  const theme = useTheme();
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [renderedPageNumber, setRenderedPageNumber] = useState(1);
  const [ref, { width: wrapperWidth, height: wrapperHeight }] =
    useElementSize();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [prevSize, setPrevSize] = useState({ height: 0, width: 0 });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleNext = () => {
    setPageNumber((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setPageNumber((prevActiveStep) => prevActiveStep - 1);
  };

  const fitHorizontal = useMemo(() => {
    const wRatio = pageWidth / wrapperWidth;
    const hRatio = pageHeight / wrapperHeight;
    if (wRatio < hRatio) {
      return false;
    }
    return true;
  }, [pageHeight, pageWidth, wrapperWidth, wrapperHeight]);

  return (
    <div className={'w-full h-full max-w-4xl p-1 lg:p-5'}>
      <div className={'w-full h-full overflow-x-hidden'} ref={ref}>
        <Document file={props.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {renderedPageNumber && renderedPageNumber !== pageNumber ? (
            <Page
              key={renderedPageNumber}
              className="prevPage"
              pageNumber={renderedPageNumber}
              width={prevSize.width}
              height={prevSize.height}
            />
          ) : null}

          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            width={fitHorizontal ? wrapperWidth : undefined}
            height={!fitHorizontal ? wrapperHeight : undefined}
            scale={1.0}
            onLoadSuccess={(page) => {
              if (numPages > 1) {
                setPageWidth(page.width);
                setPageHeight(page.height);
                setPrevSize({
                  height: page.height,
                  width: page.width,
                });
              }
            }}
            onRenderSuccess={() => setRenderedPageNumber(pageNumber)}
          />
        </Document>

        {numPages > 1 && (
          <MobileStepper
            variant="dots"
            steps={numPages}
            position="static"
            activeStep={pageNumber - 1}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={pageNumber === numPages}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
                NEXT
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={pageNumber === 1}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                BACK
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
