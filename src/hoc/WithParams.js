import { useParams } from "react-router-dom";

//HOC to pass params to class components
export function withParams(Component) {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}
