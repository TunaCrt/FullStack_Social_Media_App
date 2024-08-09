import { useState,useEffect, useMemo } from "react";
import axios from "axios";
import { signUp } from "./api";
import { Input } from "./components/Input";
export function SignUp() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();
  const [apiProgress, setApiProgress] = useState(false);
  const [succesMessage, setSuccesMessage] = useState();
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState()

  useEffect(() => {
    setErrors(function(lastErrors){
      return{
        ...lastErrors,
        username:undefined
      }
    })
  }, [username])

  useEffect(() => {
    setErrors(function(lastErrors){
      return{
        ...lastErrors,
        email:undefined
      }
    })
  }, [email])
  useEffect(() => {
    setErrors(function(lastErrors){
      return{
        ...lastErrors,
        password:undefined
      }
    })
  }, [password])
  

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
    } catch(axiosError) {
        if(axiosError.response?.data && axiosError.response.data.status ===400){
          setErrors(axiosError.response.data.validationErrors)
        }else{
          setGeneralError('unexpected error. please try again')
        }
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

  const passwordRepeatError = useMemo(()=>{
    if(password && password !== passwordRepeat){
      return  'şifreler eşleşmiyor'
    }
    return '';
  },[password,passwordRepeat]);
  
  console.log(username);
  return (
    <>
      <div className="container">
        <div className="text-center">
          <h1>Sign Up</h1>
        </div>
        <div className="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
          <form>
            
            <Input id="username" label="Username" error={errors.username} onChange={(event) => setUsername(event.target.value)}/>
            <Input id="email" label="E-mail" error={errors.email} onChange={(event) => setEmail(event.target.value)} />
            <Input id="password" label="password" error={errors.password} onChange={(event) => setPassword(event.target.value)} />
            <Input id="passwordRepeat" label="passwordRepeat" error={passwordRepeatError} onChange={(event) => setPasswordRepeat(event.target.value)} />


         
            {succesMessage && (
              <div className="alert alert-success">{succesMessage}</div>
            )}
            {generalError && (
              <div className="alert alert-danger">{generalError}</div>
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
