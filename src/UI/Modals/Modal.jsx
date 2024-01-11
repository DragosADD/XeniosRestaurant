import ReactDOM from 'react-dom';

const Backdrop = (props) => {
  return (
    <div
      onClick={props.onClose}
      className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm"
    ></div>
  );
};
const ModalOverlay = (props) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="rounded-lg bg-cyan-100 p-6 shadow-md">
        {props.children}
      </div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onClose}>{props.children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
