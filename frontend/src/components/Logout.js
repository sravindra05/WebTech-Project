import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";


class Logout extends React.Component {
  componentDidMount(){
    function change(){
      window.location.href='/login';
    }
    function logout(){
      
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "loginstring=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setTimeout(change,3000);
      
    }
    logout();
  }
  render() {
    
    return (
      <>
        <main >
         
            <h3 className="center">Logout</h3>
            <p>Logging you out. We hope to see you again.</p>
         
        </main>
      </>
    );
  }
}
export default Logout;
