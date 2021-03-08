import React, { useState } from "react";
import pwnedPasswordCheck from "./pwnedPassword";
import ModalPwned from "./ModalPwned";
import { numberWithSpaces } from "./utils";

const PwnedCheck = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(0);
  const [IsLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const breach = await pwnedPasswordCheck(password);
    setIsLoading(false);
    setResult(numberWithSpaces(breach));
    setPassword("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          id="pass_input"
          name="password"
          value={password}
          onChange={(e) => {
            setResult(0);
            setPassword(e.target.value);
          }}
        />
        <button type="submit" disabled={IsLoading}>
          Check{" "}
        </button>
      </form>

      <h4>{password}</h4>

      {result !== 0 ? <ModalPwned result={result} /> : ""}
    </>
  );
};

export default PwnedCheck;
