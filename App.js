import BaseRoute from "./navigation/stack-navigation/BaseRoute";
import ContextProvider from "./context/ContextProvider";
import { getAccessFromRefresh } from "./src/components/RefreshToken"; 
import UserContext from "./context/UserContext";
import { useContext } from "react";


const App = () => {

  const {setAccessToken} = useContext(UserContext)

  getAccessFromRefresh()
  .then((res) => {
    setAccessToken(res)
  })
  

  return (
      <BaseRoute />
  );
};


export default App;


