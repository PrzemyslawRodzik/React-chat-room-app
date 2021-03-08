import React from "react";

const ModalPwned = ({ result }) => {
  return (
    <div>
      {result !== "-1" ? (
        <h4>Password has been pwned {result} times !</h4>
      ) : (
        <h4> Good news — no pwnage found! </h4>
      )}
    </div>
  );
};

// ModalPwned.propTypes = {
//   result: PropTypes.string.isRequired,
// };
// ModalPwned.defaultProps = {};

export default ModalPwned;
