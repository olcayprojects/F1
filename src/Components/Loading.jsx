import scar from "../images/Auto_Racing_Yellow_Digiflag-SC.gif";
export default function Loading() {
  return (
    <div className="container-fluid bg-black text-danger">
      <img
        src={scar}
        className="img-fluid rounded float-left"
        alt="Loading"
        srcSet=""
      />
    </div>
  );
}
