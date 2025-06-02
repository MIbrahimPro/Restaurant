import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BiKey } from "react-icons/bi";

const PasswordModal = forwardRef(({ passwordData, passwordError, onChange, onSubmit }, ref) => {
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
      id="passwordModal"
      tabIndex="-1"
      aria-labelledby="passwordModalLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="passwordModalLabel">
              Change Password
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => modalInstance.current.hide()}
            ></button>
          </div>
          <div className="modal-body">
            {passwordError && (
              <div className="alert alert-danger">{passwordError}</div>
            )}
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => modalInstance.current.hide()}
            >
              Cancel
            </button>
            <button className="btn btn-warning" onClick={onSubmit}>
              <BiKey size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PasswordModal;