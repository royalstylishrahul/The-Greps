import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError:false };
  }

  static getDerivedStateFromError(){
    return { hasError:true };
  }

  componentDidCatch(error,errorInfo){
    console.error("App Crash:",error,errorInfo);
  }

  render(){
    if(this.state.hasError){
      return(
        <div style={{
          height:"100vh",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center",
          fontFamily:"sans-serif"
        }}>
          <h2>Something went wrong</h2>

          <button 
            onClick={()=>window.location.reload()}
            style={{
              padding:"10px 20px",
              marginTop:"15px",
              cursor:"pointer"
            }}
          >
            Reload App
          </button>

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;