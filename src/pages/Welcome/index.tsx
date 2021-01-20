import { useHistory } from "react-router-dom";

function Welcome() {
  const history = useHistory();
  // history.push('/home', {name: "ahahah"})
  return <div>hello</div>;
}

export default Welcome;
