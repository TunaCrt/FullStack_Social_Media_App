import { useState } from "react";
import axios from "axios";
import { signUp } from "./api";
export function SignUp() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();
  const [apiProgress, setApiProgress] = useState(false);
  const [succesMessage, setSuccesMessage] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccesMessage();
    setApiProgress(true);

    try {
      const response = await signUp({
        username,
        email,
        password,
      });
      setSuccesMessage(response.data.message);
    } catch {
        console.log("hata")
    } finally {
      setApiProgress(false);
    }
    /*signUp({
            username,
            email,
            password
        })
        .then((response)=>{
            setSuccesMessage(response.data.message)
        })
        .finally(() => setApiProgress(false)) */
  };

  console.log(username);
  return (
    <>
      <div className="container">
        <div className="text-center">
          <h1>Sign Up</h1>
        </div>
        <div className="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                className="form-control"
                id="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">email</label>
              <input
                className="form-control"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Password">Password</label>
              <input
                className="form-control"
                id="Password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="PasswordRepeat">Password Repeat</label>
              <input
                className="form-control"
                id="PasswordRepeat"
                onChange={(event) => setPasswordRepeat(event.target.value)}
              />
            </div>
            {succesMessage && (
              <div className="alert alert-success">{succesMessage}</div>
            )}
            <button
              className="btn btn-primary"
              disabled={apiProgress || !password || password !== passwordRepeat}
              onClick={onSubmit}
            >
              {apiProgress && (
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                ></span>
              )}{" "}
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
