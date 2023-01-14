import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';

export const ModalPropTypes = {
  showModal: PropTypes.bool.isRequired,
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

type Props = InferPropTypes<typeof ModalPropTypes>;

export function Modal(props: Props) {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(props.showModal);
  }, [props.showModal]);
  return (
    <>
      {showModal ? (
        <>
          {/* Main modal */}
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-h-screen max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* Modal header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t bg-blue-800 ">
                  {props?.header}
                  <button
                    className="bg-transparent border-0 text-white float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-white opacity-7 h-7 w-7 text-2xl block py-0">
                      x
                    </span>
                  </button>
                </div>
                {/* Modal body */}
                <div className="relative p-6 flex-auto">{props?.children}</div>
                {/* Modal footer */}
                <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                  {props?.footer}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
