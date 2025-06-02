
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { BiPlus, BiSave } from "react-icons/bi";

const AddressModal = forwardRef(
  ({ mode, currentAddress, onChange, onSubmit }, ref) => {
    const modalRef = useRef(null);
    const modalInstance = useRef(null);

    // Expose show() and hide() to parent via ref
    useImperativeHandle(ref, () => ({
      show: () => modalInstance.current?.show(),
      hide: () => modalInstance.current?.hide(),
    }));

    // Initialize Bootstrap 5 modal on mount
    useEffect(() => {
      if (window.bootstrap && modalRef.current && !modalInstance.current) {
        modalInstance.current = new window.bootstrap.Modal(modalRef.current);
      }
    }, []);

    return (
      <div
        className="modal fade"
        id="addressModal"
        tabIndex="-1"
        aria-labelledby="addressModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addressModalLabel">
                {mode === "add" ? "Add Address" : "Edit Address"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => modalInstance.current.hide()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={currentAddress.title}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="3"
                  value={currentAddress.address}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => modalInstance.current.hide()}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={onSubmit}>
                {mode === "add" ? <BiPlus size={18} /> : <BiSave size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default AddressModal;
